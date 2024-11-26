import { Request, Response, NextFunction } from "express";
import pick from "lodash/pick";
import { ServiceClient } from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "./constants";

export const sanitizeHeaders = (req: Request) => {
  const ALLOWED_HEADERS = ["x-access-token", "x-refresh-token"];
  return pick(req.headers ?? {}, ALLOWED_HEADERS);
};

export const serviceRouterMiddleware =
  (serviceName: string, prefixUrl: string = "", version?: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceClient = new ServiceClient(registryAddress, serviceIdentity);

      const response = await serviceClient.callService<any>(serviceName, {
        method: req.method,
        url: `${prefixUrl}${req.url}`,
        data: req.body,
        headers: sanitizeHeaders(req),
      });
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
