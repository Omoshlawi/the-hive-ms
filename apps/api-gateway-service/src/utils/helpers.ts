import { Request, Response, NextFunction } from "express";
import pick from "lodash/pick";
import { generateDefaultKey, ServiceClient } from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "./constants";

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
//   const key =
// typeof getKey === "function" ? getKey(req) : generateDefaultKey(req);
//   return swrCache<T>({
//     fetcher,
// key: `${prefix}:${key}`,
//     logger: logger,
//     redis,
//     ...defaultSWRCacheConfig,
//   });
// };

// export const invalidate = (req: Request, getKey?: (req: Request) => string) => {
//   const prefix = `${serviceIdentity.name}:${serviceIdentity.version}`;
//   const key =
//     typeof getKey === "function" ? getKey(req) : generateDefaultKey(req);
//   return invalidatePattern(redis, {
//     pattern: `${prefix}:${key}*`,
//     logger,
//     count: 100,
//   });
// };


export const sanitizeHeaders = (req: Request) => {
  const ALLOWED_HEADERS = ["x-access-token", "x-refresh-token"];
  return pick(req.headers ?? {}, ALLOWED_HEADERS);
};

export const serviceRouterMiddleware =
  (
    serviceName: string,
    prefixUrl: string = "",
    version?: string,
    includeHeaders: boolean = false,
    timeout?: number
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
      if (includeHeaders) {
        const response = await serviceClient.callServiceWithResponse(
          serviceName,
          {
            method: req.method,
            url: `${prefixUrl}${req.url}`,
            data: req.body,
            timeout,
            headers: sanitizeHeaders(req),
          }
        );
        return res.set(response.headers).json(response.data);
      }
      const response = await serviceClient.callService<any>(serviceName, {
        method: req.method,
        url: `${prefixUrl}${req.url}`,
        data: req.body,
        headers: sanitizeHeaders(req),
        timeout,
      });
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
