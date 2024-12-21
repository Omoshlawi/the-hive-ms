import { APIException, ServiceClient } from "@hive/core-utils";
import { NextFunction, Response, Request } from "express";
import { sanitizeHeaders } from "./helpers";

export const requireAuthentication =
  (serviceClient: ServiceClient) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("x-access-token");
      if (!token)
        throw new APIException(401, { detail: "Unauthorized - Token missing" });
      const user = await serviceClient.callService(
        "@hive/authentication-service",
        {
          method: "GET",
          url: "/users/profile",
          headers: sanitizeHeaders(req),
          params: {},
        }
      );
      (req as any).user = user;
      return next();
    } catch (error) {
      next(error);
    }
  };
