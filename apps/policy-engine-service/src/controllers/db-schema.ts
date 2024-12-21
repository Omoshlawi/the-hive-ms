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
import { ResourcesModel } from "@/models";

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
    const resourceFilter = req.query.resource;
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

export const sourceServiceDBSchemaToResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceFilter = req.query.resource;
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
    const dbTasks = Object.keys(schemas.schemas)
      .filter((key) => {
        if (!key.includes("_prisma_migrations"))
          if (!resourceFilter)
            // Filter migration tables out
            return true; // Include all resources if no resource filter included
        if (resourceFilter === key) return true; // Filter only specified resources
        return false;
      })
      .map(async (resource) => {
        const resourceExist = await ResourcesModel.findUnique({
          where: { name: resource },
        });
        if (!resourceExist) {
          // create new resource if dont exist
          return await ResourcesModel.create({
            data: {
              name: resource,
              dataPoints: schemas.schemas[resource].columnNames,
              description: `${name}:${version ?? "*"} ${resource} Resource`,
            },
          });
        }
        const hasNotChanged =
          resourceExist.dataPoints.length ===
            schemas.schemas[resource].columnNames.length &&
          resourceExist.dataPoints.every((d) =>
            schemas.schemas[resource].columnNames.includes(d)
          ); // Ensures the resource datapoints hasent changed
        if (hasNotChanged) return resourceExist; // Return resource if no changes detected

        return await ResourcesModel.update({
          where: { name: resource },
          data: { dataPoints: schemas.schemas[resource].columnNames },
        }); // update resource if changes detected
      });
    const result = await Promise.allSettled(dbTasks);
    const success = result
      .filter((re) => re.status === "fulfilled")
      .map((re) => re.value);
    const failure = result
      .filter((re) => re.status === "rejected")
      .map((re) => re.reason);
    return res.json({ success, failure });
  } catch (error) {
    next(error);
  }
};
