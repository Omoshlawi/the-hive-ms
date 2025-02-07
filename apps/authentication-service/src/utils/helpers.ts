import { TokenPayload } from "@/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { configuration } from "./constants";
import { generateDefaultKey } from "@hive/core-utils";
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
 * const data = await getCachedResource(
 *   request,
 *   () => fetchDataFromAPI(),
 *   (req) => `custom-key-${req.params.id}`
 * );
 * ```
 */
// export const getCachedResource = <T>(
//   req: Request,
//   fetcher: () => Promise<T>,
//   getKey?: (req: Request) => string
// ) => {
//   const prefix = `${serviceIdentity.name}:${serviceIdentity.version}${req?.context?.organizationId ? ":" + req.context.organizationId : ""}`;
//   const key =
// typeof getKey === "function" ? getKey(req) : generateDefaultKey(req);
//   return swrCache<T>({
//     fetcher,
//     key: `${prefix}:${key}`,
//     logger: logger,
//     redis,
//     ...defaultSWRCacheConfig,
//   });
// };

// export const invalidateCachedResource = (
//   req: Request,
//   getKey?: (req: Request) => string
// ) => {
//   const prefix = `${serviceIdentity.name}:${serviceIdentity.version}${req?.context?.organizationId ? ":" + req.context.organizationId : ""}`;
//   const key =
//     typeof getKey === "function" ? getKey(req) : generateDefaultKey(req);
//   return smartInvalidatePattern(redis, {
//     pattern: `${prefix}:${key}*`,
//     logger,
//     count: 100,
//     keyThreshold: 5000,
//     batchSize: 500,
//   });
// };

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export function generateUserToken(payload: {
  userId: string;
  organizationId?: string;
  roles?: string[] | string;
  // personId?: string;
}) {
  const accessPayload: TokenPayload = {
    ...payload,
    type: "access",
  };
  const refreshPayload: TokenPayload = { ...payload, type: "refresh" };
  const accessToken = jwt.sign(accessPayload, configuration.auth.auth_secrete, {
    expiresIn: configuration.auth.access_token_age as any,
  });
  const refreshToken = jwt.sign(
    refreshPayload,
    configuration.auth.auth_secrete,
    {
      expiresIn: configuration.auth.refresh_token_age as any,
    }
  );
  return { accessToken, refreshToken };
}

export const checkPassword = async (hash: string, password: string) => {
  return await bcrypt.compare(password, hash);
};
