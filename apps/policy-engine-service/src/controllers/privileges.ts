import { NextFunction, Request, Response } from "express";
import { PrivilegesModel, ResourcesModel } from "../models";
import { PrivilegeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getPrivileges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await PrivilegesModel.findMany({
      where: {
        voided: false,
        organizationId: req.context?.organizationId ?? null,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getPrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PrivilegesModel.findUniqueOrThrow({
      where: {
        id: req.params.privilegeId,
        voided: false,
        organizationId: req.context?.organizationId ?? null,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addPrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PrivilegeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Get resource
    const resourceDataPoints = await ResourcesModel.findUnique({
      where: { id: validation.data.resourceId },
      select: { dataPoints: true },
    });
    if (!resourceDataPoints)
      throw new APIException(400, {
        resourceId: { _errors: ["Invalid resource"] },
      });
    const item = await PrivilegesModel.create({
      data: {
        ...validation.data,
        createdBy: req?.context!.userId,
        permitedResourceDataPoints:
          validation.data.permitedResourceDataPoints.filter((point) =>
            resourceDataPoints.dataPoints.includes(point)
          ), // Only pick points that are in the resource
        organizationId: req.context?.organizationId ?? null,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PrivilegeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Get resource
    const resourceDataPoints = await ResourcesModel.findUnique({
      where: { id: validation.data.resourceId },
      select: { dataPoints: true },
    });
    if (!resourceDataPoints)
      throw new APIException(400, {
        resourceId: { _errors: ["Invalid resource"] },
      });
    const item = await PrivilegesModel.update({
      where: { id: req.params.privilegeId, voided: false },
      data: {
        ...validation.data,
        permitedResourceDataPoints:
          validation.data.permitedResourceDataPoints.filter((point) =>
            resourceDataPoints.dataPoints.includes(point)
          ), // Only pick points that are in the resource
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PrivilegeSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Get resource
    const resourceDataPoints = await ResourcesModel.findUnique({
      where: { id: validation.data.resourceId },
      select: { dataPoints: true },
    });
    if (!resourceDataPoints)
      throw new APIException(400, {
        resourceId: { _errors: ["Invalid resource"] },
      });
    const item = await PrivilegesModel.update({
      where: { id: req.params.privilegeId, voided: false },
      data: {
        ...validation.data,
        permitedResourceDataPoints:
          validation.data.permitedResourceDataPoints?.filter((point) =>
            resourceDataPoints.dataPoints.includes(point)
          ), // Only pick points that are in the resource
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PrivilegesModel.update({
      where: { id: req.params.privilegeId, voided: false },
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

export const purgePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PrivilegesModel.delete({
      where: { id: req.params.privilegeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
