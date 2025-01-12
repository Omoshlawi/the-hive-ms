import { type ServiceIdentity, Logger } from "@/types";
import winston from "winston";

export const createLogger: (service: ServiceIdentity) => Logger = (
  serviceId: ServiceIdentity
) => {
  const logger: Logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: `${serviceId.name}:${serviceId.version}` },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: "error.log", level: "error" }),
      // new winston.transports.File({ filename: "warning.log", level: "warn" }),
      // new winston.transports.File({ filename: "combined.log" }),
    ],
  });

  if (serviceId.env !== "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      })
    );
  }
  return logger as Logger;
};
