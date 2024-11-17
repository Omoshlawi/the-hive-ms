import config from "config";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  nameAliase: config.get("name"),
  port: config.get("port") as string | null | undefined,
};
