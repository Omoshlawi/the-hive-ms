const serviceName = "@hive/tenants-service";
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
];
