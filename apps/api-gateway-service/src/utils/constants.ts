export const BASE_DIR = process.cwd();
import { RegistryAddress, ServiceIdentity } from "@hive/core-utils";
import config from "config";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  db: config.get("db") as string | undefined | null,
  port: config.get("port") as string | undefined | null,
  backend_url: config.get("backend_url") as string,
  registry: {
    url: config.get("registry.url") as string,
    version: config.get("registry.version") as string,
  },
  auth: {
    google_id: config.get("google_client_id") as string,
    google_secrete: config.get("google_client_secrete") as string,
    github_id: config.get("github_client_id") as string,
    github_secrete: config.get("github_client_secrete") as string,
    auth_secrete: config.get("auth_secrete") as string,
    access_token_age: config.get("token.access_expiry") as string,
    refresh_token_age: config.get("token.refresh_expiry") as string,
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
