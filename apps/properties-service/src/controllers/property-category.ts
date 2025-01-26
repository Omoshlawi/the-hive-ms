import { NextFunction, Request, Response } from "express";
import { PropertyCategoriesModel } from "../models";
import { PropertyCategorySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCachedResource, invalidateCachedResource } from "@/utils";

export const getPropertyCategorys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCachedResource(req, () =>
      PropertyCategoriesModel.findMany({
        where: { voided: false },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );
    return res.json({ results: results.data });
  } catch (error) {
    next(error);
  }
};

export const getPropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      PropertyCategoriesModel.findUniqueOrThrow({
        where: { id: req.params.propertyCategoryId, voided: false },
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

export const addPropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyCategorySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyCategoriesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyCategorySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyCategoriesModel.update({
      where: { id: req.params.propertyCategoryId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyCategorySchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyCategoriesModel.update({
      where: { id: req.params.propertyCategoryId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyCategoriesModel.update({
      where: { id: req.params.propertyCategoryId, voided: false },
      data: {
        voided: true,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgePropertyCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyCategoriesModel.delete({
      where: { id: req.params.propertyCategoryId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
