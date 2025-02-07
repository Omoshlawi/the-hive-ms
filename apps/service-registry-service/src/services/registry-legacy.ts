import { Service, UnregisteredService } from "@/types";
import semver from "semver";
import logger from "./logger";
import { deprecate } from "node:util";

class Registry {
  services: Service[];
  timeout: number;
  constructor() {
    this.services = [];
    this.timeout = 15;
  }

  private getKey({ host, name, port, version }: UnregisteredService) {
    return `${name}::${version}::${host}::${port}`;
  }

  serviceExists(service: UnregisteredService) {
    return this.serviceIndex(service) !== -1;
  }

  serviceIndex(service: UnregisteredService) {
    return this.services.findIndex(
      (service_) => this.getKey(service) === this.getKey(service_)
    );
  }

  register(service: UnregisteredService) {
    this.cleanUp(); //remove timeout services
    // If no service in registry
    const serviceIndex = this.serviceIndex(service);
    if (serviceIndex === -1) {
      // add service to registry
      this.services.push({
        ...service,
        timestamp: Date.now() / 1000, //epock time converted toseconds
        instance: "",
      });
      logger.info(
        `[+]Added service ${service.name} ${service.version} at ${service.host}:${service.port}`
      );
      // console.log(this.services);

      return service;
    }

    // if service exist the update timestamp preventing timeout
    this.services[serviceIndex] = {
      ...(this.services[serviceIndex] as any),
      timestamp: Date.now() / 1000,
    };
    logger.info(
      `[+]Udated service ${service.name} ${service.version} at ${service.host}:${service.port}`
    );
    // console.log(this.services);
    return service;
  }

  unregister(service: UnregisteredService) {
    const serviece = this.services.splice(this.serviceIndex(service), 1)[0];
    // console.log(this.services);

    return service;
  }

  cleanUp() {
    const now = Date.now() / 1000;
    this.services = this.services.filter(
      ({ timestamp }) => (timestamp as number) + this.timeout > now
    );
  }

  get(name: string, version: string) {
    this.cleanUp();
    const candidates = this.services.filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    // Load balance by randomly selecting service
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  getServices() {
    this.cleanUp();
    return this.services;
  }
}
export default Registry;
