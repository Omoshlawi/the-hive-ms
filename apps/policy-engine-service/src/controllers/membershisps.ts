import { NextFunction, Request, Response } from "express";
import { OrganizationMembershipsModel, RolesModel } from "../models";
import {
  OrganizationMembershipSchema,
  OrganizationMembershipsFilterSchema,
} from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  ServiceClient,
} from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "@/utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";

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
    const organizationId = req.context?.organizationId;
    const memberUserId = req.context?.userId;

    const {
      context,
      search,
      organizationId: organization,
      memberUserId: memberUser,
    } = validation.data;
    if (context === "organization" && !organizationId)
      throw new APIException(403, {
        detail: "organization context required",
      });

    const results = await OrganizationMembershipsModel.findMany({
      where: {
        AND: [
          {
            voided: false,
            memberUserId:
              context === "individual"
                ? memberUserId!
                : context === "organization"
                  ? memberUser
                  : undefined,
            organizationId:
              context === "organization"
                ? organizationId!
                : context === "individual"
                  ? organization
                  : undefined,
          },
          {
            OR: search
              ? [
                  {
                    memberUser: {
                      path: ["person", "name"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["username"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["person", "email"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["person", "phoneNumber"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["person", "firstName"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["person", "lastName"],
                      string_contains: search,
                    },
                  },
                  {
                    memberUser: {
                      path: ["person", "surname"],
                      string_contains: search,
                    },
                  },
                ]
              : undefined,
          },
        ],
      },
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

    const { roleIds, memberUserId, ...data } = validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: req.context?.organizationId ?? null,
      },
      select: { id: true },
    });

    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);

    const memberUser = await serviceClient.callService<{
      id: string;
      username: string;
      person: {
        id: string;
        firstName: any;
        lastName: any;
        surname: any;
        phoneNumber: string;
        gender: string;
        email: string;
        name: any;
      };
    }>("@hive/authentication-service", {
      method: "GET",
      url: `/users/${memberUserId}`,
      headers: sanitizeHeaders(req),
      params: {
        v: "custom:select(id,username,person:select(id,firstName,lastName,surname,phoneNumber,gender,email,name))",
      },
    });

    // TODO Update user async using middleware subscription if its value changes from auth service
    const item = await OrganizationMembershipsModel.create({
      data: {
        ...data,
        organizationId: req.context!.organizationId!,
        memberUserId,
        memberUser,
        membershipRoles: {
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
    const { roleIds, memberUserId, ...data } = validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: req.context?.organizationId!,
      },
      select: { id: true },
    });

    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: {
        ...data,
        memberUserId,
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
    const { roleIds, memberUserId, ...data } = validation.data;
    // ensure roles bellong to the organization
    const rolesInOrganization = await RolesModel.findMany({
      where: {
        id: { in: validation.data.roleIds },
        organizationId: req.context?.organizationId!,
      },
      select: { id: true },
    });

    const item = await OrganizationMembershipsModel.update({
      where: { id: req.params.membershipId, voided: false },
      data: {
        ...data,
        memberUserId,
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
