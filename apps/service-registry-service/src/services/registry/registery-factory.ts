import { configuration } from "../../utils";
import logger from "../logger";
import redis from "../redis";
import MemoryStorage from "./memory-storage";
import RedisStorage from "./redis-storage";
import Registry from "./registry";

export const getRegistry = () => {
  logger.info("Initialize registry instance...");
  const storage =
    configuration.storageStrategy === "redis"
      ? new RedisStorage(redis)
      : new MemoryStorage();
  const registry = new Registry(storage);
  logger.info(
    `${configuration.storageStrategy === "redis" ? "Redis" : "Memory"} Storage strategy registry instantanciated`
  );
  return registry;
};

const globalForRegistry = global as unknown as { registry: Registry };

export const registry = globalForRegistry.registry || getRegistry();

if (process.env.NODE_ENV !== "production")
  globalForRegistry.registry = registry;
