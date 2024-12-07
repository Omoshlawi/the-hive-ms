import { APIException } from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { Context } from "./types";

export const requireContext = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("x-access-token");
    if (!token)
      throw new APIException(401, { detail: "Unauthorized - Token missing" });
    const context: Context = decode(token) as Context;
    req.context = context;
    return next();
  } catch (error) {
    next(error);
  }
};

