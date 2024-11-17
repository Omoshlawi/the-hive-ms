import { NextFunction, Request, Response } from "express";

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
    });
  } catch (error) {
    next(error);
  }
};
