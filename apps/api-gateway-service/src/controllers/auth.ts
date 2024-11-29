import { NextFunction, Request, Response } from "express";
import { ServiceClient } from "@hive/core-utils";
import { registryAddress, sanitizeHeaders, serviceIdentity } from "@/utils";
export const authRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const response = await serviceClient.callServiceWithResponse(
      "@hive/auth-service",
      {
        method: req.method,
        url: req.url,
        data: req.body,
        timeout: 5000,
        headers: sanitizeHeaders(req),
      }
    );
    return res.set(response.headers).json(response.data);
  } catch (error) {
    next(error);
  }
};
