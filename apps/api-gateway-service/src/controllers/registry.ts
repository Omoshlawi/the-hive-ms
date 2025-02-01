import serviceClient from "@/services/service-client";
import { NextFunction, Request, Response } from "express";

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resp = await serviceClient.getServices();
    return res.json(resp);
  } catch (error) {
    next(error);
  }
};
