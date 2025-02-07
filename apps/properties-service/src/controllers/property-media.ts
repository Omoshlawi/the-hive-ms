import { NextFunction, Request, Response } from "express";
import { PropertyMediaModel } from "../models";
import { PropertyMediaSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCachedResource, invalidateCachedResource } from "@/utils";

export const getPropertiesMedias = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCachedResource(req, () =>
      PropertyMediaModel.findMany({
        where: { voided: false, propertyId: req.params.propertyId },
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

export const getPropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      PropertyMediaModel.findUniqueOrThrow({
        where: {
          id: req.params.propertyMediaId,
          voided: false,
          propertyId: req.params.propertyId,
        },
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
      data: { ...validation.data, propertyId: req.params.propertyId! },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

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
      where: {
        id: req.params.propertyMediaId,
        voided: false,
        propertyId: req.params.propertyId,
      },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

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
      where: {
        id: req.params.propertyMediaId,
        voided: false,
        propertyId: req.params.propertyId,
      },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

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
      where: {
        id: req.params.propertyMediaId,
        voided: false,
        propertyId: req.params.propertyId,
      },
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

export const purgePropertiesMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyMediaModel.delete({
      where: {
        id: req.params.propertyMediaId,
        voided: false,
        propertyId: req.params.propertyId,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};
