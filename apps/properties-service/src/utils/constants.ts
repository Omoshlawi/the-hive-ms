import "dotenv/config";
export const BASE_DIR = process.cwd();
import { RegistryAddress, ServiceIdentity } from "@hive/core-utils";
import config from "config";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  db: config.get("db") as string | undefined | null,
  redis: config.get("redis_db") as string | undefined | null,
  port: config.get("port") as string | undefined | null,
  jwt: config.get("jwt") as string | undefined | null,
  backend_url: config.get("backend_url") as string,
  registry: {
    url: config.get("registry.url") as string,
    version: config.get("registry.version") as string,
  },
};

export const registryAddress: RegistryAddress = {
  url: configuration.registry.url,
  version: configuration.registry.version,
};

export const serviceIdentity: ServiceIdentity = {
  name: configuration.name,
  version: configuration.version,
};
