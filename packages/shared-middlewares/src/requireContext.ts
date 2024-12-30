import { APIException } from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { Context } from "./types";

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
export const requireOrganizationContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.context?.organizationId)
      throw new APIException(403, {
        detail: "Fobbiden - Required organization context",
      });
    return next();
  } catch (error) {
    next(error);
  }
};
