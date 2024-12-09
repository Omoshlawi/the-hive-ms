const serviceName = "@hive/authentication-service";
let serviceVersion

module.exports = [
  {
    path: "/auth",
    prefix: "",
    serviceName,
    serviceVersion,
    includeHeaders: true
  },
  {
    path: "/change-context",
    prefix: "/change-context",
    serviceName,
    serviceVersion,
    includeHeaders: true
  },
  {
    path: "/exit-context",
    prefix: "/exit-context",
    serviceName,
    serviceVersion,
    includeHeaders: true
  },
  {
    path: "/users",
    prefix: "/users",
    serviceName,
    serviceVersion,
  },
]
