import { ServiceIdentity } from "@hive/core-utils";
import config from "config";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  nameAliase: config.get("name"),
  port: config.get("port") as string | null | undefined,
  redis: config.get("redis_db") as string | undefined | null,
  storageStrategy: config.get("storage_strategy") as
    | "redis"
    | "memory"
    | null
    | undefined,
};

export const serviceId: ServiceIdentity = {
  name: configuration.name,
  version: configuration.version,
};
