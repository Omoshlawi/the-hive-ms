import { registryAddress, serviceIdentity } from "@/utils";
import { ServiceClient } from "@hive/core-utils";

const globalForServiceClient = global as unknown as {
  serviceClient: ServiceClient;
};

export const serviceClient =
  globalForServiceClient.serviceClient ||
  new ServiceClient(registryAddress, serviceIdentity);

if (process.env.NODE_ENV !== "production")
  globalForServiceClient.serviceClient = serviceClient;

export default serviceClient;
