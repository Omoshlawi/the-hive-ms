import "dotenv/config";

import logger from "@/services/logger";

import ApplicationServer from "@/app";
import { createRedisClient } from "@hive/core-utils";
import { configuration } from "./utils";

export const redisClient = createRedisClient(
  configuration.redis!,
  () => {
    logger.info(
      `Connection to Redis server ${configuration.redis!} succesfull`
    );
  },
  (err) => logger.error(`Error connecting to redis service:  ${err}`)
);

// Start the server
const startServer = async () => {
  try {
    const server = new ApplicationServer();
    await server.start();
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle process signals for graceful shutdown
["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
  process.on(signal, async () => {
    logger.info(`Received ${signal}, initiating graceful shutdown`);
    try {
      const server = new ApplicationServer();
      await server.shutdown();
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown:", error);
      process.exit(1);
    }
  });
});

// Start the server
startServer();
