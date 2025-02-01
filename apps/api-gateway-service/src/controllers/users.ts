import serviceClient from "@/services/service-client";
import { NextFunction, Request, Response } from "express";
export const usersRouterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
