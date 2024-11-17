export type Service = {
  host: string;
  port: number;
  name: string;
  version: string;
  timestamp?: number;
  instance: string;
};

export type UnregisteredService = Pick<
  Service,
  "host" | "name" | "port" | "timestamp" | "version"
>;
