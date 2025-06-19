const serviceName = "@hive/appointment-service";
let serviceVersion;

module.exports = [
  {
    path: "/appointments",
    prefix: "/appointments",
    serviceName,
    serviceVersion,
  },
  {
    path: "/appointment-types",
    prefix: "/appointment-types",
    serviceName,
    serviceVersion,
  },
];
