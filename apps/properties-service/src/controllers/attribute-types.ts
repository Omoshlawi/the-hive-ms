import { NextFunction, Request, Response } from "express";
import { AttributeTypesModel } from "../models";
import { AttributeTypeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCached } from "@/utils";

export const getAttributeTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCached(req, () =>
      AttributeTypesModel.findMany({
        where: { voided: false },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );
    return res.json({ results: results.data, ...results.metadata });
  } catch (error) {
    next(error);
  }
};

export const getAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCached(req, () =>
      AttributeTypesModel.findUniqueOrThrow({
        where: { id: req.params.attributeTypeId, voided: false },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );
    return res.json(item.data);
  } catch (error) {
    next(error);
  }
};

export const addAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AttributeTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AttributeTypesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AttributeTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AttributeTypesModel.update({
      where: { id: req.params.attributeTypeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AttributeTypeSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AttributeTypesModel.update({
      where: { id: req.params.attributeTypeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AttributeTypesModel.update({
      where: { id: req.params.attributeTypeId, voided: false },
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

export const purgeAttributeType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AttributeTypesModel.delete({
      where: { id: req.params.attributeTypeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
