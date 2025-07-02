import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { TenantReferencesModel } from "../models";
import { TenenantReferenceValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";

export const getApplicationTenantReferences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;
    type Args = Parameters<typeof TenantReferencesModel.findMany>[0];
    const filters: Args = {
      where: { applicationId },
    };
    const results = await TenantReferencesModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await TenantReferencesModel.count(
      pick(filters, "where")
    );
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;

    const item = await TenantReferencesModel.findUniqueOrThrow({
      where: { id: req.params.referenceId, applicationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId!;

    const validation = await TenenantReferenceValidator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenantReferencesModel.create({
      data: { ...validation.data, applicationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;

    const validation = await TenenantReferenceValidator.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenantReferencesModel.update({
      where: { id: req.params.referenceId, applicationId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;

    const validation =
      await TenenantReferenceValidator.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenantReferencesModel.update({
      where: { id: req.params.referenceId, applicationId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;

    const item = await TenantReferencesModel.delete({
      where: { id: req.params.referenceId, applicationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeApplicationTenantReference = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;

    const item = await TenantReferencesModel.delete({
      where: { id: req.params.referenceId, applicationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
