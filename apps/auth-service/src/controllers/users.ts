import { UsersModel } from "@/models";
import { getMultipleOperationCustomRepresentationQeury } from "@hive/core-utils";
import { Request, Response, NextFunction } from "express";

export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await UsersModel.findUnique({
      where: { id: req.user?.id },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
