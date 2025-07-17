import { NextFunction, Request, Response } from "express";
import pick from "lodash/pick";
import { AdditionalChargesModel } from "../models";
import { AdditionalChargeValidator } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  paginate,
} from "@hive/core-utils";

export const getAdditionalCharges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;
    type Args = Parameters<typeof AdditionalChargesModel.findMany>[0];
    const filters: Args = {
      where: { voided: false, agreementId },
    };
    const results = await AdditionalChargesModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await AdditionalChargesModel.count(
      pick(filters, "where")
    );
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AdditionalChargesModel.findUniqueOrThrow({
      where: { id: req.params.chargeId, voided: false, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const validation = await AdditionalChargeValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AdditionalChargesModel.create({
      data: { ...validation.data, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const validation = await AdditionalChargeValidator.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AdditionalChargesModel.update({
      where: { id: req.params.chargeId, voided: false, agreementId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const validation = await AdditionalChargeValidator.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AdditionalChargesModel.update({
      where: { id: req.params.chargeId, voided: false, agreementId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AdditionalChargesModel.update({
      where: { id: req.params.chargeId, voided: false, agreementId },
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

export const purgeAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const agreementId = req!.params!.agreementId!;

    const item = await AdditionalChargesModel.delete({
      where: { id: req.params.chargeId, voided: false, agreementId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
