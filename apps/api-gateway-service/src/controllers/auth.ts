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
    console.log(sanitizeHeaders(req), "==============>");

    const response = await serviceClient.callService<any>(
      "@hive/auth-service",
      {
        method: req.method,
        url: req.url,
        data: req.body,
        timeout: 5000,
      }
    );
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
