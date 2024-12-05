import { NextFunction, Request, Response } from "express";
import { OrganizationMembershipsModel, RolesModel } from "../models";
import {
  OrganizationMembershipSchema,
  OrganizationMembershipsFilterSchema,
} from "@/utils/validators";
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
    const validation = await OrganizationMembershipsFilterSchema.safeParseAsync(
      req.query
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { memberPersonId, organizationId } = validation.data;
    const results = await OrganizationMembershipsModel.findMany({
      where: { voided: false, memberPersonId, organizationId },
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

    const { roleIds, memberPersonId, organizationId, ...data } =
      validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: organizationId,
      },
      select: { id: true },
    });

    const item = await OrganizationMembershipsModel.create({
      data: {
        ...data,
        memberPerson: { id: memberPersonId },
        organizationId,
        memberPersonId,
        membershipRoles: {
          createMany: {
            skipDuplicates: true,
            data: rolesInOrganization.map((role) => ({ roleId: role.id })),
          },
        },
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
    const { roleIds, memberPersonId, organizationId, ...data } =
      validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: organizationId,
      },
      select: { id: true },
    });

    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: {
        ...data,
        memberPerson: { id: memberPersonId },
        organizationId,
        memberPersonId,
        membershipRoles: {
          deleteMany: {
            membershipId: req.params.membershipId,
          },
          createMany: {
            skipDuplicates: true,
            data: rolesInOrganization.map((role) => ({ roleId: role.id })),
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
    const { roleIds, memberPersonId, organizationId, ...data } =
      validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: organizationId,
      },
      select: { id: true },
    });

    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: {
        ...data,
        memberPerson: { id: memberPersonId },
        organizationId,
        memberPersonId,
        membershipRoles: {
          deleteMany: {
            membershipId: req.params.membershipId,
          },
          createMany: {
            skipDuplicates: true,
            data: rolesInOrganization.map((role) => ({ roleId: role.id })),
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
