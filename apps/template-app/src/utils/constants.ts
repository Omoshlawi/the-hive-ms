export const BASE_DIR = process.cwd();
import config from "config";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  db: config.get("db") as string | undefined | null,
  port: config.get("port") as string | undefined | null,
  jwt: config.get("jwt") as string | undefined | null,
  backend_url: config.get("backend_url") as string,
  registry: {
    url: config.get("registry.url") as string,
    version: config.get("registry.version") as string,
  },
};
