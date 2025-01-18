import { Service } from "@/types";

/**
 * Interface defining the storage operations required for the registry.
 * Implementations must provide these methods for different storage backends.
 */
interface StorageStrategy {
  /** Retrieves all stored services */
  getAll(): Promise<Service[]>;
  /** Saves or updates a service in storage */
  save(service: Service): Promise<void>;
  /** Removes a service by its key */
  remove(key: string): Promise<void>;
  /** Clears all services from storage */
  clear(): Promise<void>;
}

export default StorageStrategy;
