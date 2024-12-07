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

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await UsersModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await UsersModel.findUniqueOrThrow({
      where: { id: req.params.userId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
