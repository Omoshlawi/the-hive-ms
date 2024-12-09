import { NextFunction, Request, Response } from "express";
import db, { getTableFields } from "@/services/db";
import {
  APIException,
  ResourcesSchemas,
  ServiceClient,
} from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "@/utils";
import { ServiceSchema } from "@/utils/validators";
import { sanitizeHeaders } from "@hive/shared-middlewares";

export const getDatabaseSchemas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ schemas: await getTableFields(db) });
  } catch (error) {
    next(error);
  }
};

export const pullServiceDatabaseSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ServiceSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const { name, version } = validation.data;
    const schemas = await serviceClient.callService<ResourcesSchemas>(
      name,
      {
        method: "GET",
        url: `/resources-schema`,
        headers: sanitizeHeaders(req),
      },
      version
    );

    return res.json(schemas);
  } catch (error) {
    return next(error);
  }
};
