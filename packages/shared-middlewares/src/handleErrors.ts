import { executeRollBackTasks } from "./tasks";
import { NextFunction, Request, Response } from "express";
import { createLogger, handlePrismaErrors } from "@hive/core-utils";
import { type ServiceIdentity } from "@hive/core-utils";

export const handleErrorsMiddleWare =
  (serviceId: ServiceIdentity) =>
  async (error: any, req: Request, res: Response, next: NextFunction) => {
    let _errors;
    //IS API exception
    if (error.status) {
      return res.status(error.status).json(error.errors);
    }

    // Error during rollback or processing prisma exception
    try {
      executeRollBackTasks(req, serviceId);
      _errors = handlePrismaErrors(error);
    } catch (error_: any) {
      _errors = { status: 500, errors: { detail: error_?.message } };
    }

    if (_errors) return res.status(_errors.status).json(_errors.errors);
    createLogger(serviceId).error("Error handler middleware: " + error.message);
    return res.status(500).json({ detail: "Internal Server Error" });
  };
