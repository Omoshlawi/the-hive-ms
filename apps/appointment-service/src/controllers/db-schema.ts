import { NextFunction, Request, Response } from "express";
import db, { getTableFields } from "@/services/db";

export const getDatabaseSchemas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ schemas: await getTableFields(db) });
  } catch (error) {
    next(error);
  }
};
