import { Logger } from "winston";

export type ServiceIdentity = {
  name: string;
  version: string;
  instance?: string;
  env?: "developement" | "production" | "sandbox";
};

export interface Service {
  host: string;
  port: number;
  name: string;
  version: string;
  timestamp?: number;
  instance?: string;
}

export type { Logger };

export type RegistryAddress = {
  url: string;
  version: string;
};
