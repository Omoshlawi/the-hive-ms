import { z } from "zod";

export const OrganizationMembershipsFilterSchema = z.object({
  memberPersonId: z.string().uuid().optional(),
  organizationId: z.string().uuid().optional(),
});

export const PrivilegeSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  organizationId: z.string().uuid("invalid organization"),
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
  organizationId: z.string().uuid("invalid organization"),
  memberPersonId: z.string().uuid("invalid person"),
  roleIds: z.array(z.string().uuid("invalid role")),
});

export const RolePrivilegeSchema = z.object({
  roleId: z.string().uuid("invalid role"),
  privilegeId: z.string().uuid("invalid privilege"),
});

export const RoleSchema = z.object({
  name: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  organizationId: z.string().uuid("invalid organization"),
  privileges: z.array(z.string().uuid()),
});
