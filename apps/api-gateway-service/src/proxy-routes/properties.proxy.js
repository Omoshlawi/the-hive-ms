const serviceName = "@hive/properties-service";
let serviceVersion

module.exports = [
  {
    path: "/relationship-types",
    prefix: "/relationship-types",
    serviceName,
    serviceVersion,
  },
  {
    path: "/attribute-types",
    prefix: "/attribute-types",
    serviceName,
    serviceVersion,
  },
  {
    path: "/categories",
    prefix: "/categories",
    serviceName,
    serviceVersion,
  },
  {
    path: "/relationship-types",
    prefix: "/relationship-types",
    serviceVersion,
    serviceName
  },
  {
    path: "/amenities",
    prefix: "/amenities",
    serviceVersion,
    serviceName
  },
  {
    path: "/properties",
    prefix: "/properties",
    serviceVersion,
    serviceName
  },
]
