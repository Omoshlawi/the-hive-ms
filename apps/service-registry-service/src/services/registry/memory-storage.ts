import { Service } from "@/types";
import StorageStrategy from "./storage-strategy";
import Registry from "./registry";

/**
 * In-memory implementation of the StorageStrategy interface.
 * Stores services in an array within the application's memory.
 */
class MemoryStorage implements StorageStrategy {
  private services: Service[] = [];

  /**
   * Retrieves all services from memory storage.
   * @returns Promise resolving to an array of all stored services
   */
  async getAll(): Promise<Service[]> {
    return this.services;
  }

  /**
   * Saves or updates a service in memory storage.
   * @param service - The service to save or update
   */
  async save(service: Service): Promise<void> {
    const index = this.services.findIndex(
      (s) => Registry.getKey(s) === Registry.getKey(service)
    );
    if (index !== -1) {
      this.services[index] = service;
    } else {
      this.services.push(service);
    }
  }

  /**
   * Removes a service from memory storage by its key.
   * @param key - The unique key of the service to remove
   */
  async remove(key: string): Promise<void> {
    this.services = this.services.filter(
      (service) => Registry.getKey(service) !== key
    );
  }

  /**
   * Clears all services from memory storage.
   */
  async clear(): Promise<void> {
    this.services = [];
  }
}

export default MemoryStorage;
