import { NextFunction, Request, Response } from "express";
import { OrganizationsModel } from "../models";
import { OrganizationSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await OrganizationsModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationsModel.findUniqueOrThrow({
      where: { id: req.params.organizationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OrganizationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OrganizationsModel.create({
      data: { ...validation.data, createdBy: {} }, // TODO Get User and add info
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OrganizationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OrganizationsModel.update({
      where: { id: req.params.organizationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OrganizationSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await OrganizationsModel.update({
      where: { id: req.params.organizationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationsModel.update({
      where: { id: req.params.organizationId, voided: false },
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

export const purgeOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationsModel.delete({
      where: { id: req.params.organizationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
