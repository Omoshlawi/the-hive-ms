import { NextFunction, Request, Response } from "express";
import { RelationshipTypesModel } from "../models";
import { RelationshipTypeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCachedResource, invalidateCachedResource } from "@/utils";

export const getRelationshipTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCachedResource(req, () =>
      RelationshipTypesModel.findMany({
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

export const getRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      RelationshipTypesModel.findUniqueOrThrow({
        where: { id: req.params.relationshipTypeUuid, voided: false },
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

export const addRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipTypesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipTypesModel.update({
      where: { id: req.params.relationshipTypeUuid, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipTypeSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipTypesModel.update({
      where: { id: req.params.relationshipTypeUuid, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RelationshipTypesModel.update({
      where: { id: req.params.relationshipTypeUuid, voided: false },
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

export const purgeRelationshipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RelationshipTypesModel.delete({
      where: { id: req.params.relationshipTypeUuid, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};
