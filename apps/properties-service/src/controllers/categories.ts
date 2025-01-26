import { NextFunction, Request, Response } from "express";
import { CategoriesModel } from "../models";
import { CategorySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCachedResource, invalidateCachedResource } from "@/utils";

export const getCategorys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCachedResource(req, () =>
      CategoriesModel.findMany({
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

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      CategoriesModel.findUniqueOrThrow({
        where: { id: req.params.categoryId, voided: false },
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

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await CategorySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await CategoriesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await CategorySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await CategoriesModel.update({
      where: { id: req.params.categoryId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await CategorySchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await CategoriesModel.update({
      where: { id: req.params.categoryId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await CategoriesModel.update({
      where: { id: req.params.categoryId, voided: false },
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

export const purgeCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await CategoriesModel.delete({
      where: { id: req.params.categoryId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};
