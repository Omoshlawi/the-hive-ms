const serviceName = "@hive/listings-service";
let serviceVersion;

module.exports = [
  {
    path: "/listings",
    prefix: "/listings",
    serviceName,
    serviceVersion,
    authenticate: false,
  },
  {
    path: "/financing-options",
    prefix: "/financing-options",
    serviceName,
    serviceVersion,
    authenticate: false,
  },
  {
    path: "/ownership-types",
    prefix: "/ownership-types",
    serviceName,
    serviceVersion,
    authenticate: false,
  },
];
