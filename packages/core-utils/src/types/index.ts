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

export interface PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: { cause?: string; target?: string[] };
  message: string;
  name: string;
}

export interface ResourcesSchemas {
  schemas: Schemas;
}

export interface Schemas {
  [resource: string]: ResourceSchema;
}

export interface ResourceSchema {
  columnNames: string[];
  orderedColumns: OrderedColumn[];
}

export interface OrderedColumn {
  name: string;
  position: number;
  type: string;
  nullable: boolean;
}
