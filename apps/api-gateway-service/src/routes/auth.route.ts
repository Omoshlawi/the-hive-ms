import { NextFunction, Request, Response } from "express";
import { ServiceClient } from "@hive/core-utils";
import { configuration, registryAddress, serviceId } from "@/utils";
export const authRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({
      method: req.method,
      path: req.params,
      url: req.url,
      route: req.route,
      query: req.query,
      body: req.body,
      params: req.params,
    });

    const serviceClient = new ServiceClient(registryAddress, serviceId);
    const response = await serviceClient.callService<any>("auth-service", {
      method: req.method,
      url: req.url,
      data: req.body,
      params: req.query,
    });

    return res.json(response);
  } catch (error) {
    next(error);
  }
};
