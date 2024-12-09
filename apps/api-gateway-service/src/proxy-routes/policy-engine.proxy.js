const serviceName = "@hive/policy-engine-service";
let serviceVersion

module.exports =  [
  {
    path: "/role-privileges",
    prefix: "/role-privileges",
    serviceName,
    serviceVersion,
  },
  {
    path: "/resources",
    prefix: "/resources",
    serviceName,
    serviceVersion,
  },
  {
    path: "/organization-membership",
    prefix: "/organization-membership",
    serviceName,
    serviceVersion,
  },
  {
    path: "/organizations",
    prefix: "/organizations",
    serviceName,
    serviceVersion,
  },
  {
    path: "/privileges",
    prefix: "/privileges",
    serviceVersion,
    serviceName
  },
  {
    path: "/roles",
    prefix: "/roles",
    serviceVersion,
    serviceName
  },
  {
    path: "/resources-schema",
    prefix: "/resources-schema",
    serviceVersion,
    serviceName
  },
]
