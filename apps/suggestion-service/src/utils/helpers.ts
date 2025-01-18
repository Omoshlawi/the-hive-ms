// TODO Uncoment to unlock redist caching capabilities

// import logger from "@/services/logger";
// import redis from "@/services/redis";
// import {
//   defaultSWRCacheConfig,
//   swrCache,
//   toQueryParams,
// } from "@hive/core-utils";
/**
 * Retrieves cached data using SWR (Stale-While-Revalidate) caching strategy
 *
 * @template T - The type of data being cached
 *
 * @param {Request} req - The incoming request object
 * @param {() => Promise<T>} fetcher - Function that returns a promise resolving to the data to be cached
 * @param {(req: Request) => string} [getKey] - Optional function to generate a custom cache key from the request
 *
 * @returns {Promise<T>} Promise that resolves to the cached or freshly fetched data
 *
 * @example
 * ```typescript
 * const data = await getCached(
 *   request,
 *   () => fetchDataFromAPI(),
 *   (req) => `custom-key-${req.params.id}`
 * );
 * ```
 */
// export const getCached = <T>(
//   req: Request,
//   fetcher: () => Promise<T>,
//   getKey?: (req: Request) => string
// ) => {
//   const prefix = `${serviceIdentity.name}:${serviceIdentity.version}`;
//   const params = toQueryParams(req.query);
//   const key = typeof getKey === "function" ? getKey(req) : req.url;
//   return swrCache<T>({
//     fetcher,
//     key: `${prefix}:${key}${params}`,
//     logger: logger,
//     redis,
//     ...defaultSWRCacheConfig,
//   });
// };
