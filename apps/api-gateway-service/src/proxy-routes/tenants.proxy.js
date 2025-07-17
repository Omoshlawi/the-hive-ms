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
    path: "/rental-applications",
    prefix: "/rental-applications",
    serviceName,
    serviceVersion,
  },
  {
    path: "/rental-agreement",
    prefix: "/rental-agreement",
    serviceName,
    serviceVersion,
  },
];
