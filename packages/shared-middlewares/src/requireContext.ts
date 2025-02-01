import {
  APIException,
  nullifyExceptionAsync,
  ServiceClient,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { Context, Organization } from "./types";
import { sanitizeHeaders } from "./helpers";

export const requireContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-access-token") ?? req.header("x-refresh-token");
    if (!token)
      throw new APIException(403, { detail: "Fobbiden - Required context" });
    const context: Context = decode(token) as Context;
    req.context = context;
    return next();
  } catch (error) {
    next(error);
  }
};
export const optionalContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-access-token") ?? req.header("x-refresh-token");
    if (!token) return next();
    const context: Context = decode(token) as Context;
    req.context = context;
    return next();
  } catch (error) {
    next(error);
  }
};
export const requireOrganizationContext =
  (serviceClient: ServiceClient, requireOrganization: boolean = false) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.context?.organizationId)
        throw new APIException(403, {
          detail: "Fobbiden - Required organization context",
        });

      if (!requireOrganization) return next();

      const res = await nullifyExceptionAsync(
        async () =>
          await serviceClient.callService<{
            results: Array<{
              organization: Organization;
            }>;
          }>("@hive/policy-engine-service", {
            method: "GET",
            url: `/organization-membership`,
            params: {
              memberUserId: req.context?.userId,
              organizationId: req.context?.organizationId,
              v: "custom:select(organization:select(id,name,description))",
            },
            headers: sanitizeHeaders(req),
          })
      )();
      if (!res?.results?.length) {
        throw new APIException(401, { detail: "Unauthorized - Invalid Token" });
      }
      req.context = {
        ...req.context,
        organization: res.results?.[0]?.organization,
      };
      return next();
    } catch (error) {
      next(error);
    }
  };
