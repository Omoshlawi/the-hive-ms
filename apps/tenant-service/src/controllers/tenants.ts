import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { TenantsModel } from "../models";
import { TenantValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  nullifyExceptionAsync,
  paginate,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { Person } from "@/types";
import { ID_GEN_CONFIG } from "@/utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";

export const getTenants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof TenantsModel.findMany>[0];
    const filters: Args = {
      where: { status: "ACTIVE", organizationId: req.context?.organizationId },
    };
    const results = await TenantsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await TenantsModel.count(pick(filters, "where"));
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenantsModel.findUniqueOrThrow({
      where: { id: req.params.tenantId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenantValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { personId } = validation.data;
    // get tenant number
    const { identifier } = await serviceClient.callService<{
      identifier: string;
    }>("@hive/policy-engine-service", {
      url: "/id-gen",
      method: "POST",
      data: { ...ID_GEN_CONFIG.tenant },
      headers: sanitizeHeaders(req),
    });
    const getPerson = nullifyExceptionAsync(() =>
      serviceClient.callService<Person>("@hive/authentication-service", {
        url: `/person/${personId}`,
        method: "GET",
        headers: sanitizeHeaders(req),
      })
    );
    const person = await getPerson();
    if (!person)
      throw new APIException(400, {
        personId: { _errors: ["Invalid person"] },
      });
    const item = await TenantsModel.create({
      data: {
        ...validation.data,
        tenantNumber: identifier,
        person: person,
        organizationId: req.context?.organizationId,
        createdBy: req.context?.userId,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenantValidator.omit({
      personId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenantsModel.update({
      where: { id: req.params.tenantId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await TenantValidator.omit({ personId: true })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await TenantsModel.update({
      where: { id: req.params.tenantId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenantsModel.update({
      where: { id: req.params.tenantId, voided: false },
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

export const purgeTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await TenantsModel.delete({
      where: { id: req.params.tenantId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
