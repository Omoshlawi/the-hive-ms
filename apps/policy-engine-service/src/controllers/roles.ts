import { NextFunction, Request, Response } from "express";
import { PrivilegesModel, RolesModel } from "../models";
import { RoleSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await RolesModel.findMany({
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

export const getRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RolesModel.findUniqueOrThrow({
      where: {
        id: req.params.roleId,
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

export const addRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RoleSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { privileges, ...data } = validation.data;
    // only pick privileges that are in the same organization
    const organizationId = req.context?.organizationId;

    const privilegesInSameOrganization = await PrivilegesModel.findMany({
      where: {
        id: { in: privileges },
        organizationId: organizationId ?? null,
      },
      select: { id: true },
    });
    const item = await RolesModel.create({
      data: {
        ...data,
        organizationId: organizationId ?? null,
        createdBy: req?.context!.userId,
        privileges: {
          createMany: {
            skipDuplicates: true,
            data: privilegesInSameOrganization.map((p) => ({
              privilegeId: p.id,
            })),
          },
        },
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RoleSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { privileges, ...data } = validation.data;
    // only pick privileges that are in the same organization
    const organizationId = req.context?.organizationId;
    const privilegesInSameOrganization = await PrivilegesModel.findMany({
      where: {
        id: { in: privileges },
        organizationId: organizationId ?? null,
      },
      select: { id: true },
    });
    const item = await RolesModel.update({
      where: { id: req.params.roleId, voided: false },
      data: {
        ...data,
        privileges: {
          deleteMany: { roleId: req.params.roleId }, // delete current asociation
          createMany: {
            // Just adds bt dont delete privileges not found in the input array
            skipDuplicates: true,
            data: privilegesInSameOrganization.map((p) => ({
              privilegeId: p.id,
            })),
          },
        },
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RoleSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { privileges, ...data } = validation.data;
    // only pick privileges that are in the same organization
    const organizationId = req.context?.organizationId;

    const privilegesInSameOrganization = await PrivilegesModel.findMany({
      where: {
        id: { in: privileges },
        organizationId: organizationId ?? null,
      },
      select: { id: true },
    });
    const item = await RolesModel.update({
      where: { id: req.params.roleId, voided: false },
      data: {
        ...data,
        privileges: {
          deleteMany: { roleId: req.params.roleId }, // delete current asociation
          createMany: {
            // Just adds bt dont delete privileges not found in the input array
            skipDuplicates: true,
            data: privilegesInSameOrganization.map((p) => ({
              privilegeId: p.id,
            })),
          },
        },
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const organizationId = req.context?.organizationId;
    const item = await RolesModel.update({
      where: { id: req.params.roleId, voided: false },
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

export const purgeRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RolesModel.delete({
      where: { id: req.params.roleId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
