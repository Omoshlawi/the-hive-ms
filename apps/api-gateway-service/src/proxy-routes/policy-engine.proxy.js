const serviceName = "@hive/policy-engine-service";
let serviceVersion

module.exports =  [
  {
    path: "/role-privileges",
    prefix: "/role-privileges",
    serviceName,
    serviceVersion,
    authenticate:true
  },
  {
    path: "/resources",
    prefix: "/resources",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/organization-membership",
    prefix: "/organization-membership",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/organizations",
    prefix: "/organizations",
    serviceName,
    serviceVersion,
    authenticate:true

  },
  {
    path: "/privileges",
    prefix: "/privileges",
    serviceVersion,
    serviceName,
    authenticate:true

  },
  {
    path: "/roles",
    prefix: "/roles",
    serviceVersion,
    serviceName,
    authenticate:true

  },
  {
    path: "/resources-schema",
    prefix: "/resources-schema",
    serviceVersion,
    serviceName,
    authenticate:true

  },
]
