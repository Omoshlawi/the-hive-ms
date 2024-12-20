export type GatewayProxyRoute = {
  path: string;
  prefix?: string;
  serviceName: string;
  serviceVersion?: string;
  includeHeaders?: boolean;
};

