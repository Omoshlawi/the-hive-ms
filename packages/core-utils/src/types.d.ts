export type ServiceIdentity = {
  name: string;
  version: string;
  instance?: string;
  env?: "developement" | "production";
};
