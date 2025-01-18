import { Redis } from "ioredis";
import { Logger } from "winston";

/**
 * Type alias for the data fetching function.
 * @template T The type of data being fetched
 */
export type Fetcher<T> = () => Promise<T>;

/**
 * Configuration options for the SWR cache function.
 * @template T The type of data being cached
 */
export interface CacheOptions<T> {
  /** Redis client instance for cache storage */
  redis: Redis;

  /**
   * Unique key for cache entry.
   * @example 'user:123', 'products:list', 'settings:global'
   */
  key: string;

  /**
   * Function that fetches fresh data when cache is invalid or missing.
   * Should return a Promise resolving to data of type T.
   * @example
   * ```typescript
   * const fetcher = () => fetch('api/users/123').then(r => r.json())
   * ```
   */
  fetcher: Fetcher<T>;

  /**
   * Time-to-live for cache entries in milliseconds.
   * @example 3600000 // 1 hour
   */
  ttl: number;

  /**
   * Optional type guard function to validate cached data.
   * Use this to ensure type safety when reading from cache.
   * @param data Unknown data from cache
   * @returns Type predicate indicating if data matches type T
   * @example
   * ```typescript
   * const isUserData = (data: unknown): data is UserData => {
   *   if (typeof data !== 'object' || !data) return false;
   *   return 'id' in data && 'name' in data;
   * }
   * ```
   */
  validate?: (data: unknown) => data is T;

  /**
   * Maximum age (in milliseconds) of stale data before forcing a refresh.
   * @default Infinity
   */
  maxStaleAge?: number;

  /**
   * Age (in milliseconds) at which to trigger background revalidation.
   * @default ttl * 0.5 (50% of TTL)
   */
  revalidateAfter?: number;

  /**
   * Logger object from caller service
   */
  logger: Logger;
}

/**
 * Result returned by the SWR cache function.
 * @template T The type of cached data
 */
export interface CacheResult<T> {
  /** The cached or freshly fetched data */
  data: T;

  /** Metadata about the cache operation */
  metadata: {
    /** Whether the data came from cache */
    fromCache: boolean;
    /** Age of the data in milliseconds, null if fresh */
    age: number | null;
    /** Whether background revalidation is in progress */
    revalidating: boolean;
  };
}

// Set to track ongoing revalidations and prevent duplicates
const revalidating = new Set<string>();

/**
 * Implements the Stale-While-Revalidate caching strategy.
 * Returns cached data immediately (if available) while updating the cache in the background.
 *
 * @template T The type of data being cached
 * @param options Configuration options for the cache operation
 * @returns Promise resolving to the cached or fresh data with metadata
 *
 * @throws Error if cache operations fail
 *
 * @example
 * Basic usage:
 * ```typescript
 * interface UserData {
 *   id: string;
 *   name: string;
 * }
 *
 * const result = await swrCache<UserData>({
 *   redis: redisClient,
 *   key: 'user:123',
 *   fetcher: () => fetchUser('123'),
 *   ttl: 3600000
 * });
 * ```
 *
 * @example
 * With validation:
 * ```typescript
 * const result = await swrCache<UserData>({
 *   redis: redisClient,
 *   key: 'user:123',
 *   fetcher: () => fetchUser('123'),
 *   ttl: 3600000,
 *   validate: (data: unknown): data is UserData => {
 *     if (typeof data !== 'object' || !data) return false;
 *     return 'id' in data && 'name' in data;
 *   },
 *   maxStaleAge: 7200000,    // Force refresh after 2 hours
 *   revalidateAfter: 1800000 // Background refresh after 30 minutes
 * });
 * ```
 */
export async function swrCache<T>({
  logger,
  redis,
  key,
  fetcher,
  ttl,
  validate,
  maxStaleAge = Infinity,
  revalidateAfter = ttl * 0.5, // Revalidate after 50% of TTL
}: CacheOptions<T>): Promise<CacheResult<T>> {
  /**
   * Helper function to store data in cache
   * @param data The data to cache
   */
  const setCache = async (data: T): Promise<void> => {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    logger.info(`Caching data for ${key}`);
    await redis.set(key, JSON.stringify(cacheData), "PX", ttl);
  };

  /**
   * Helper function to handle background revalidation
   * Prevents duplicate revalidations for the same key
   */
  const revalidateInBackground = async (): Promise<void> => {
    if (revalidating.has(key)) return;

    revalidating.add(key);
    try {
      const freshData = await fetcher();
      await setCache(freshData);
    } catch (error) {
      logger.error(`Background revalidation failed: ${error}`);
    } finally {
      revalidating.delete(key);
    }
  };

  try {
    // Try to get data from cache
    const cachedRaw = await redis.get(key);

    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      const age = Date.now() - cached.timestamp;

      // Validate the cached data if validator provided
      if (!validate || validate(cached.data)) {
        // Check if data is too stale
        if (age > maxStaleAge) {
          // Data is too stale, force refresh
          logger.info("Data is too stale, force refresh");
          const freshData = await fetcher();
          await setCache(freshData);
          return {
            data: freshData,
            metadata: { fromCache: false, age: 0, revalidating: false },
          };
        }

        // If data is getting stale, trigger background revalidation
        if (age > revalidateAfter) {
          logger.info(
            "data is getting stale, triggering background revalidation"
          );
          revalidateInBackground().catch((error) =>
            logger.error(`Error while revalidating in background: ${error}`)
          );
        }
        logger.info("Got data from cache");
        return {
          data: cached.data,
          metadata: {
            fromCache: true,
            age,
            revalidating: revalidating.has(key),
          },
        };
      }
    }

    // Cache miss or invalid data
    logger.info("Cache missing or invalid data -> fetching from source");
    const freshData = await fetcher();
    await setCache(freshData);

    return {
      data: freshData,
      metadata: { fromCache: false, age: 0, revalidating: false },
    };
  } catch (error) {
    logger.error(
      `[SWRCache]: Cache operation failed: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}
