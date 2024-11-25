import { NextFunction, Request, Response } from "express";
import { PropertyAttributesModel } from "../models";
import { PropertyAttributeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getPropertyAttributes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await PropertyAttributesModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getPropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyAttributesModel.findUniqueOrThrow({
      where: { id: req.params.propertyAttributeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addPropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAttributeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAttributesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAttributeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAttributesModel.update({
      where: { id: req.params.propertyAttributeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAttributeSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAttributesModel.update({
      where: { id: req.params.propertyAttributeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyAttributesModel.update({
      where: { id: req.params.propertyAttributeId, voided: false },
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

export const purgePropertyAttribute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyAttributesModel.delete({
      where: { id: req.params.propertyAttributeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
