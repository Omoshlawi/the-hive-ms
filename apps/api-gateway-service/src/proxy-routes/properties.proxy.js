const serviceName = "@hive/properties-service";
let serviceVersion

module.exports = [
  {
    path: "/relationship-types",
    prefix: "/relationship-types",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/attribute-types",
    prefix: "/attribute-types",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/categories",
    prefix: "/categories",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/relationship-types",
    prefix: "/relationship-types",
    serviceVersion,
    serviceName,
    authenticate:true

  },
  {
    path: "/relationships",
    prefix: "/relationships",
    serviceVersion,
    serviceName,
    authenticate:true

  },
  {
    path: "/amenities",
    prefix: "/amenities",
    serviceVersion,
    serviceName,
    authenticate:true

  },
  {
    path: "/properties",
    prefix: "/properties",
    serviceVersion,
    serviceName,
    authenticate:true
  },
]
