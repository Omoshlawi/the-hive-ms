import { registryAddress, serviceIdentity } from "@/utils";
import { ServiceClient } from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";

export const getServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const resp = await serviceClient.getServices();
    return res.json(resp);
  } catch (error) {
    next(error);
  }
};
