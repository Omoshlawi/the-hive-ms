import { executeRollBackTasks } from "./tasks";
import { NextFunction, Request, Response } from "express";
import { createLogger, handlePrismaErrors } from "@hive/core-utils";
import { type ServiceIdentity } from "@hive/core-utils";

export const handleErrorsMiddleWare =
  (serviceId: ServiceIdentity) =>
  async (error: any, req: Request, res: Response, next: NextFunction) => {
    executeRollBackTasks(req, serviceId);
    if (error.status) {
      return res.status(error.status).json(error.errors);
    }
    const errors = handlePrismaErrors(error);
    if (errors) return res.status(errors.status).json(errors.errors);
    createLogger(serviceId).error("Error handler middleware: " + error.message);
    return res.status(500).json({ detail: "Internal Server Error" });
  };

