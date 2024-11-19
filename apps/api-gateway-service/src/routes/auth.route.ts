import { NextFunction, Request, Response } from "express";
import { ServiceClient } from "@hive/core-utils";
import { registryAddress, serviceId } from "@/utils";
export const authRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceId);
    const response = await serviceClient.callService<any>(
      "@hive/auth-service",
      {
        method: req.method,
        url: req.url,
        data: req.body,
        params: req.query,
      }
    );
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
