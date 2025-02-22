import { NextFunction, Request, Response } from "express";
import { PrivilegesModel, RolePrivilege, RolesModel } from "../models";
import { RolePrivilegeSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getRolePrivileges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await RolePrivilege.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RolePrivilege.findUniqueOrThrow({
      where: { id: req.params.rolePrivilegeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RolePrivilegeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Ensure role and privilege bellong to same organization
    const role = await RolesModel.findUnique({
      where: { id: validation.data.roleId },
    });
    if (!role)
      throw new APIException(400, { roleId: { _errors: ["Invalid role"] } });
    const privlege = await PrivilegesModel.findUnique({
      where: { id: validation.data.privilegeId },
    });
    if (!privlege)
      throw new APIException(400, {
        roleId: { _errors: ["Invalid privilege"] },
      });
    const item = await RolePrivilege.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RolePrivilegeSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Ensure role and privilege bellong to same organization
    const role = await RolesModel.findUnique({
      where: { id: validation.data.roleId },
    });
    if (!role)
      throw new APIException(400, { roleId: { _errors: ["Invalid role"] } });
    const privlege = await PrivilegesModel.findUnique({
      where: { id: validation.data.privilegeId },
    });
    if (!privlege)
      throw new APIException(400, {
        roleId: { _errors: ["Invalid privilege"] },
      });
    const item = await RolePrivilege.update({
      where: { id: req.params.rolePrivilegeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RolePrivilegeSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // Ensure role and privilege bellong to same organization
    const role = await RolesModel.findUnique({
      where: { id: validation.data.roleId },
    });
    if (!role)
      throw new APIException(400, { roleId: { _errors: ["Invalid role"] } });
    const privlege = await PrivilegesModel.findUnique({
      where: { id: validation.data.privilegeId },
    });
    if (!privlege)
      throw new APIException(400, {
        roleId: { _errors: ["Invalid privilege"] },
      });
    const item = await RolePrivilege.update({
      where: { id: req.params.rolePrivilegeId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RolePrivilege.update({
      where: { id: req.params.rolePrivilegeId, voided: false },
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

export const purgeRolePrivilege = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RolePrivilege.delete({
      where: { id: req.params.rolePrivilegeId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
