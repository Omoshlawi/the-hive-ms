const serviceName = "@hive/tenant-service";
let serviceVersion;

module.exports = [
  {
    path: "/tenants",
    prefix: "/tenants",
    serviceName,
    serviceVersion,
  },
  {
    path: "/tenancy-applications",
    prefix: "/tenancy-applications",
    serviceName,
    serviceVersion,
  },
  {
    path: "/tenancy-agreements",
    prefix: "/tenancy-agreements",
    serviceName,
    serviceVersion,
  },
];
