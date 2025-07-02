import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { CoApplicantsModel, TenantsModel } from "../models";
import { CoApplicantValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";

export const getCoApplicants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;
    type Args = Parameters<typeof CoApplicantsModel.findMany>[0];
    const filters: Args = {
      where: { applicationId },
    };
    const results = await CoApplicantsModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await CoApplicantsModel.count(pick(filters, "where"));
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId;
    const item = await CoApplicantsModel.findUniqueOrThrow({
      where: { id: req.params.coApplicantId, applicationId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const applicationId = req.params.applicationId!;

    const validation = await CoApplicantValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { tenantNumber, relationshipType } = validation.data;
    // Validate tenants

    const tenant = await TenantsModel.findUnique({
      where: { tenantNumber, status: "ACTIVE" },
    });
    if (!tenant)
      throw new APIException(400, {
        tenantNumber: {
          _errors: ["Tenant with provided number dont exist or not active"],
        },
      });

    const item = await CoApplicantsModel.create({
      data: { relationshipType, applicationId, tenantId: tenant.id },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await CoApplicantValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await CoApplicantsModel.update({
      where: { id: req.params.coApplicantId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await CoApplicantValidator.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await CoApplicantsModel.update({
      where: { id: req.params.coApplicantId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await CoApplicantsModel.delete({
      where: { id: req.params.coApplicantId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeCoApplicant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await CoApplicantsModel.delete({
      where: { id: req.params.coApplicantId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
