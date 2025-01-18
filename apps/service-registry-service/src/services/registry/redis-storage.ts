import { Redis as RedisClient } from "@hive/core-utils";
import StorageStrategy from "./storage-strategy";
import Registry from "./registry";
import { Service } from "@/types";
import logger from "../logger";
import { serviceId } from "@/utils";

/**
 * Redis implementation of the StorageStrategy interface.
 * Stores services in Redis with automatic expiration.
 */
class RedisStorage implements StorageStrategy {
  private readonly keyPrefix = `${serviceId.name}:${serviceId.version}:live-services:`;
  private client: RedisClient;

  /**
   * Creates a new RedisStorage instance.
   * @param redisClient - Configured ioredis client instance
   */
  constructor(redisClient: RedisClient) {
    this.client = redisClient;
  }

  /**
   * Retrieves all services from Redis storage.
   * @returns Promise resolving to an array of all stored services
   */
  async getAll(): Promise<Service[]> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      if (keys.length === 0) return [];

      const services = await this.client.mget(keys);
      return services
        .filter((service): service is string => service !== null)
        .map((service) => JSON.parse(service));
    } catch (error) {
      logger.error(`[Registry.RedisStorage.getAll]: ${error}`);
      return [];
    }
  }

  /**
   * Saves or updates a service in Redis storage with automatic expiration.
   * @param service - The service to save or update
   */
  async save(service: Service): Promise<void> {
    try {
      const key = this.keyPrefix + Registry.getKey(service);
      await this.client.set(key, JSON.stringify(service), "EX", 15);
    } catch (error) {
      logger.error(`[Registry.RedisStorage.save]: ${error}`);
      throw error;
    }
  }

  /**
   * Removes a service from Redis storage by its key.
   * @param key - The unique key of the service to remove
   */
  async remove(key: string): Promise<void> {
    try {
      await this.client.del(this.keyPrefix + key);
    } catch (error) {
      logger.error(`[Registry.RedisStorage.remove]: ${error}`);
      throw error;
    }
  }

  /**
   * Clears all services from Redis storage.
   */
  async clear(): Promise<void> {
    try {
      const keys = await this.client.keys(`${this.keyPrefix}*`);
      if (keys.length > 0) {
        await this.client.del(...keys); // ioredis supports spreading keys as arguments
      }
    } catch (error) {
      logger.error(`[Registry.RedisStorage.clear]: ${error}`);
      throw error;
    }
  }
}

export default RedisStorage;
