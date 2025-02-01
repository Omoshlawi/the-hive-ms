const serviceName = "@hive/listings-service";
let serviceVersion

module.exports = [
  {
    path: "/listings",
    prefix: "/listings",
    serviceName,
    serviceVersion,
    authenticate:false
  },
]
