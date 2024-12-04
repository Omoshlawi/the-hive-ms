import { NextFunction, Request, Response } from "express";
import { RolesModel } from "../models";
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
      where: { voided: false },
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
      where: { id: req.params.roleId, voided: false },
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
    const item = await RolesModel.create({
      data: {
        ...data,
        createdBy: {},
        privilegeAssignments: {
          createMany: {
            skipDuplicates: true,
            data: privileges?.map((p) => ({ privilegeId: p })),
          },
        },
      }, // TODO get creater user and add here
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

    const item = await RolesModel.update({
      where: { id: req.params.roleId, voided: false },
      data: {
        ...data,
        privilegeAssignments: {
          createMany: {
            // Just adds bt dont delete privileges not found in the input array
            skipDuplicates: true,
            data: privileges.map((p) => ({ privilegeId: p })),
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

    const item = await RolesModel.update({
      where: { id: req.params.roleId, voided: false },
      data: {
        ...data,
        privilegeAssignments: {
          createMany: {
            // Just adds bt dont delete privileges not found in the input array
            skipDuplicates: true,
            data: (privileges ?? []).map((p) => ({ privilegeId: p })),
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
