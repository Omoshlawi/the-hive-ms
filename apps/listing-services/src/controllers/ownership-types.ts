import { NextFunction, Request, Response } from "express";
import { OwnershipTypesModel } from "../models";
import { OwnershipTypeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import pick from "lodash/pick";

export const getOwnershipTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof OwnershipTypesModel.findMany>[0];
    const filters: Args = { where: { voided: false } };
    const results = await OwnershipTypesModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await OwnershipTypesModel.count(pick(filters, "where"));
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OwnershipTypesModel.findUniqueOrThrow({
      where: { id: req.params.ownershipTypeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OwnershipTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OwnershipTypesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OwnershipTypeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OwnershipTypesModel.update({
      where: { id: req.params.ownershipTypeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OwnershipTypeSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OwnershipTypesModel.update({
      where: { id: req.params.ownershipTypeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OwnershipTypesModel.update({
      where: { id: req.params.ownershipTypeId, voided: false },
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

export const purgeOwnershipType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OwnershipTypesModel.delete({
      where: { id: req.params.ownershipTypeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
