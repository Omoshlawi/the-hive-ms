const serviceName = "@hive/listings-service";
let serviceVersion

module.exports = [
  {
    path: "/listings",
    prefix: "/listing",
    serviceName,
    serviceVersion,
    authenticate:true
  },
]
