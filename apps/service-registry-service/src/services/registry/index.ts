import { configuration } from "../../utils";
import redis from "../redis";
import MemoryStorage from "./memory-storage";
import RedisStorage from "./redis-storage";
import Registry from "./registry";

const storage =
  configuration.storageStrategy === "redis"
    ? new RedisStorage(redis)
    : new MemoryStorage();

const globalForRegistry = global as unknown as { registry: Registry };

export const registry = globalForRegistry.registry || new Registry(storage);

if (process.env.NODE_ENV !== "production")
  globalForRegistry.registry = registry;

export default registry;
