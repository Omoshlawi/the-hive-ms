import { Service, UnregisteredService } from "@/types";
import semver from "semver";
import StorageStrategy from "./storage-strategy";
import logger from "../logger";

/**
 * Main Registry class that manages service registration and discovery.
 * Supports both in-memory and Redis storage through the StorageStrategy interface.
 */
class Registry {
  private storage: StorageStrategy;
  private timeout: number;

  /**
   * Creates a new Registry instance.
   * @param storage - Storage strategy implementation to use (memory or Redis)
   */
  constructor(storage: StorageStrategy) {
    this.storage = storage;
    this.timeout = 15;
  }

  /**
   * Generates a unique key for a service.
   * @param param0 - Service parameters including host, name, port, and version
   * @returns Unique string key for the service
   */
  static getKey({ host, name, port, version }: UnregisteredService): string {
    return `${name}::${version}::${host}::${port}`;
  }

  /**
   * Removes expired services from storage.
   * A service is considered expired if its timestamp is older than the timeout period.
   */
  private async cleanUp(): Promise<void> {
    const now = Date.now() / 1000;
    const services = await this.storage.getAll();

    for (const service of services) {
      if ((service.timestamp as number) + this.timeout <= now) {
        await this.storage.remove(Registry.getKey(service));
      }
    }
  }

  /**
   * Checks if a service exists in the registry.
   * @param service - Service to check
   * @returns Promise resolving to true if the service exists, false otherwise
   */
  async serviceExists(service: UnregisteredService): Promise<boolean> {
    const services = await this.storage.getAll();
    return services.some(
      (s) => Registry.getKey(s) === Registry.getKey(service)
    );
  }

  /**
   * Registers a new service or updates an existing one.
   * @param service - Service to register
   * @returns Promise resolving to the registered service
   */
  async register(service: UnregisteredService): Promise<UnregisteredService> {
    await this.cleanUp();

    const newService: Service = {
      ...service,
      timestamp: Date.now() / 1000,
      instance: "",
    };

    await this.storage.save(newService);

    logger.info(
      `[+]Added/Updated service ${service.name} ${service.version} at ${service.host}:${service.port}`
    );

    return service;
  }

  /**
   * Unregisters a service from the registry.
   * @param service - Service to unregister
   * @returns Promise resolving to the unregistered service
   */
  async unregister(service: UnregisteredService): Promise<UnregisteredService> {
    await this.storage.remove(Registry.getKey(service));
    return service;
  }

  /**
   * Retrieves a service by name and version.
   * @param name - Service name to look for
   * @param version - Version requirement (semver compatible)
   * @returns Promise resolving to a matching service if found, undefined otherwise
   */
  async get(name: string, version: string): Promise<Service | undefined> {
    await this.cleanUp();
    const services = await this.storage.getAll();

    const candidates = services.filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );

    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * Retrieves all active services in the registry.
   * @returns Promise resolving to an array of all active services
   */
  async getServices(): Promise<Service[]> {
    await this.cleanUp();
    return this.storage.getAll();
  }
}

export default Registry;
