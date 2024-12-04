import { NextFunction, Request, Response } from "express";
import { OrganizationMembershipsModel, RolesModel } from "../models";
import { OrganizationMembershipSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getOrganizationMemberships = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await OrganizationMembershipsModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationMembershipsModel.findUniqueOrThrow({
      where: { id: req.params.membershipId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OrganizationMembershipSchema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    // ensure role bellong to the organization
    const roleInOrganization = await RolesModel.count({
      where: {
        id: validation.data.roleId,
        organizationId: validation.data.organizationId,
      },
    });
    if (roleInOrganization === 0)
      throw new APIException(401, {
        roleId: { _errors: ["role not in organization"] },
      });
    const item = await OrganizationMembershipsModel.create({
      data: {
        ...validation.data,
        memberPerson: { id: validation.data.memberPersonId },
      }, // TODO GET person by uuid and update the object
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await OrganizationMembershipSchema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // ensure role bellong to the organization
    const roleInOrganization = await RolesModel.count({
      where: {
        id: validation.data.roleId,
        organizationId: validation.data.organizationId,
      },
    });
    if (roleInOrganization === 0)
      throw new APIException(401, {
        roleId: { _errors: ["role not in organization"] },
      });
    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation =
      await OrganizationMembershipSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    // ensure role bellong to the organization
    const roleInOrganization = await RolesModel.count({
      where: {
        id: validation.data.roleId,
        organizationId: validation.data.organizationId,
      },
    });
    if (roleInOrganization === 0)
      throw new APIException(401, {
        roleId: { _errors: ["role not in organization"] },
      });
    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
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

export const purgeOrganizationMembership = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await OrganizationMembershipsModel.delete({
      where: { id: req.params.membershipId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
