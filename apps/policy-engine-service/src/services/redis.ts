// TODO Uncoment to unlock redist caching capabilities
// import { createRedisClient, Redis } from "@hive/core-utils";
// import { configuration } from "@/utils";
// import logger from "./logger";

// const globalForRedis = global as unknown as { redis: Redis };

// const redis =
//   globalForRedis.redis ||
//   createRedisClient(
//     configuration.redis!,
//     () => {
//       logger.info(
//         `Connection to Redis server ${configuration.redis!} succesfull`
//       );
//     },
//     (err) => logger.error(`Error connecting to redis service:  ${err}`)
//   );

// if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

// export default redis;
