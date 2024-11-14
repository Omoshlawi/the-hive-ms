import { type ServiceIdentity } from "@/types";
import winston from "winston";

export const createLogger = (serviceId: ServiceIdentity) => {
  const logger = winston.createLogger({
    // level: "info",
    format: winston.format.json(),
    defaultMeta: { service: `${serviceId.name}:${serviceId.version}` },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: "error.log", level: "error" }),
      new winston.transports.File({ filename: "warning.log", level: "warn" }),
    ],
  });

  if (serviceId.env !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  }
  return logger;
};
