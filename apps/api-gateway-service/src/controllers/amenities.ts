import { NextFunction, Request, Response } from "express";
import { ServiceClient } from "@hive/core-utils";
import { registryAddress, sanitizeHeaders, serviceIdentity } from "@/utils";
export const amenitiesRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);

    const response = await serviceClient.callService<any>(
      "@hive/properties-service",
      {
        method: req.method,
        url: `/amenities${req.url}`,
        data: req.body,
        headers: sanitizeHeaders(req),
      }
    );
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
