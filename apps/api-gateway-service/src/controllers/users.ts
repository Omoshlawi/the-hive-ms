import { NextFunction, Request, Response } from "express";
import { ServiceClient } from "@hive/core-utils";
import { registryAddress, sanitizeHeaders, serviceIdentity } from "@/utils";
export const usersRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const response = await serviceClient.callService<any>(
      "@hive/authentication-service",
      {
        method: req.method,
        url: `/users${req.url}`,
        data: req.body,
        headers: req.headers,
      }
    );
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
