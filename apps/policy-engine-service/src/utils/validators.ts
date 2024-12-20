import { z } from "zod";

export const OrganizationMembershipsFilterSchema = z.object({
  memberUserId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const PrivilegeSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  resourceId: z.string().uuid("invalid resource"),
  permitedResourceDataPoints: z.array(z.string().min(1, "required")),
  operations: z.array(z.enum(["Create", "Read", "Update", "Delete"])),
});

export const OrganizationSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
});

export const ResourceSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  dataPoints: z.array(z.string().min(1, "required")),
});

export const OrganizationMembershipSchema = z.object({
  memberUserId: z.string().uuid("invalid user"),
  roleIds: z.array(z.string().uuid("invalid role")),
});

export const RolePrivilegeSchema = z.object({
  roleId: z.string().uuid("invalid role"),
  privilegeId: z.string().uuid("invalid privilege"),
});

export const RoleSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  privileges: z.array(z.string().uuid()),
});

export const ServiceSchema = z.object({
  name: z.string().min(1, "required"),
  version: z.string().min(1, "Required").optional(),
});
