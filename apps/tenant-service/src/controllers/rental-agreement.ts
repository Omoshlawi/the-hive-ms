import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { RentalAgrementModel, RentalApplicationsModel } from "../models";
import { RentalAgreementValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { ID_GEN_CONFIG } from "@/utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";

export const getRentalAgreements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    type Args = Parameters<typeof RentalAgrementModel.findMany>[0];
    const filters: Args = {
      where: { voided: false },
    };
    const results = await RentalAgrementModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await RentalAgrementModel.count(pick(filters, "where"));
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalAgrementModel.findUniqueOrThrow({
      where: { id: req.params.agreementId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalAgreementValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const {
      applicationId,
      participants,
      additionalCharges,
      leaseDetails,
      rentalDetails,
      shortTermDetails,
      agreementType,
    } = validation.data;
    const organizationId = req.context!.organizationId!;
    const userId = req.context!.userId!;
    const application = await RentalApplicationsModel.findUnique({
      where: { id: applicationId },
    });
    if (!application || application.status !== "APPROVED")
      throw new APIException(400, {
        applicationId: { _errors: ["Invalid application"] },
      });
    // generate id
    const { identifier } = await serviceClient.callService<{
      identifier: string;
    }>("@hive/policy-engine-service", {
      url: "/id-gen",
      method: "POST",
      data: { ...ID_GEN_CONFIG.agreement },
      headers: sanitizeHeaders(req),
    });
    const item = await RentalAgrementModel.create({
      data: {
        ...validation.data,
        agreementNumber: identifier,
        organizationId,
        propertyId: application.propertyId,
        createdBy: userId,
        participants: participants?.length
          ? {
              createMany: {
                skipDuplicates: true,
                data: participants.map((p) => ({ ...p, organizationId })),
              },
            }
          : undefined,
        additionalCharges: additionalCharges?.length
          ? {
              createMany: {
                skipDuplicates: true,
                data: additionalCharges,
              },
            }
          : undefined,
        rentalDetails:
          agreementType === "RENTAL" ? { create: rentalDetails } : undefined,
        leaseDetails:
          agreementType === "LEASE" ? { create: leaseDetails } : undefined,
        shortTermDetails:
          agreementType === "SHORT_TERM"
            ? { create: shortTermDetails }
            : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalAgreementValidator.omit({
      additionalCharges: true,
      participants: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { leaseDetails, rentalDetails, shortTermDetails, agreementType } =
      validation.data;
    const item = await RentalAgrementModel.update({
      where: { id: req.params.agreementId, voided: false, agreementType },
      data: {
        ...validation.data,
        rentalDetails:
          agreementType === "RENTAL" ? { create: rentalDetails } : undefined,
        leaseDetails:
          agreementType === "LEASE" ? { create: leaseDetails } : undefined,
        shortTermDetails:
          agreementType === "SHORT_TERM"
            ? { create: shortTermDetails }
            : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RentalAgreementValidator.omit({
      additionalCharges: true,
      participants: true,
    })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { leaseDetails, rentalDetails, shortTermDetails, agreementType } =
      validation.data;
    const item = await RentalAgrementModel.update({
      where: { id: req.params.agreementId, voided: false },
      data: {
        ...validation.data,
        rentalDetails:
          agreementType === "RENTAL" ? { create: rentalDetails } : undefined,
        leaseDetails:
          agreementType === "LEASE" ? { create: leaseDetails } : undefined,
        shortTermDetails:
          agreementType === "SHORT_TERM"
            ? { create: shortTermDetails }
            : undefined,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalAgrementModel.update({
      where: { id: req.params.agreementId, voided: false },
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

export const purgeRentalAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await RentalAgrementModel.delete({
      where: { id: req.params.agreementId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
