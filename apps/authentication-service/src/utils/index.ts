import { RegistryAddress, ServiceIdentity } from "@hive/core-utils";
import config from "config";
import { CookieOptions } from "express";
import path from "path";
export const BASE_DIR = process.cwd();
export const MEDIA_ROOT = path.join(BASE_DIR, "media");
export const MEDIA_URL = "media";
export const PROFILE_URL = "uploads";

export const configuration = {
  version: require("./../../package.json").version,
  name: require("./../../package.json").name,
  db: config.get("db") as string | undefined | null,
  port: config.get("port") as string | undefined | null,
  backend_url: config.get("backend_url") as string,
  redis: config.get("redis_db") as string | undefined | null,

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
  authCookieConfig: {
    name: "session-token",
    config: {
      MAX_AGE: 30 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    } as CookieOptions,
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
