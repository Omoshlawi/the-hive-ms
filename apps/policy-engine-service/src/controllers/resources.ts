import { NextFunction, Request, Response } from "express";
import { ResourcesModel } from "../models";
import { ResourceSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await ResourcesModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ResourcesModel.findUniqueOrThrow({
      where: { id: req.params.resourceId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ResourceSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ResourcesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ResourceSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ResourcesModel.update({
      where: { id: req.params.resourceId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ResourceSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ResourcesModel.update({
      where: { id: req.params.resourceId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ResourcesModel.update({
      where: { id: req.params.resourceId, voided: false },
      data: {
        voided: true,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeResource = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ResourcesModel.delete({
      where: { id: req.params.resourceId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
