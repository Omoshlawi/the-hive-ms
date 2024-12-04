const serviceName = "@hive/authentication-service";
let serviceVersion

module.exports = [
  {
    path: "/auth",
    prefix: "",
    serviceName,
    serviceVersion,
  },
  {
    path: "/users",
    prefix: "/users",
    serviceName,
    serviceVersion,
  },
]
