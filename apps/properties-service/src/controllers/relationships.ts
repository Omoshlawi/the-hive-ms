import { NextFunction, Request, Response } from "express";
import { RelationshipsModel } from "../models";
import { RelationshipSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCached } from "@/utils";

export const getRelationships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCached(req, () =>
      RelationshipsModel.findMany({
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

export const getRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCached(req, () =>
      RelationshipsModel.findUniqueOrThrow({
        where: { id: req.params.relationshipId, voided: false },
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

export const addRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipsModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipsModel.update({
      where: { id: req.params.relationshipId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RelationshipSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await RelationshipsModel.update({
      where: { id: req.params.relationshipId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RelationshipsModel.update({
      where: { id: req.params.relationshipId, voided: false },
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

export const purgeRelationship = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RelationshipsModel.delete({
      where: { id: req.params.relationshipId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
