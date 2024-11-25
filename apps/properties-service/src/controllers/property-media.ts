import { NextFunction, Request, Response } from "express";
import { PropertyMediaModel } from "../models";
import { PropertyMediaSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getPropertiesMedias = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await PropertyMediaModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getPropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyMediaModel.findUniqueOrThrow({
      where: { id: req.params.propertyMediaId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addPropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyMediaSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyMediaModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyMediaSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyMediaModel.update({
      where: { id: req.params.propertyMediaId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyMediaSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyMediaModel.update({
      where: { id: req.params.propertyMediaId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyMediaModel.update({
      where: { id: req.params.propertyMediaId, voided: false },
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

export const purgePropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyMediaModel.delete({
      where: { id: req.params.propertyMediaId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
