import { NextFunction, Request, Response } from "express";
import { ListingAdditionalChargesModel } from "../models";
import { ListingAdditionalCharges } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getListingAdditionalCharges = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const results = await ListingAdditionalChargesModel.findMany({
      where: { voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const item = await ListingAdditionalChargesModel.findUniqueOrThrow({
      where: { id: req.params.chargId, voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId!;
    const validation = await ListingAdditionalCharges.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingAdditionalChargesModel.create({
      data: { ...validation.data, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingAdditionalCharges.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingAdditionalChargesModel.update({
      where: { id: req.params.chargId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingAdditionalCharges.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingAdditionalChargesModel.update({
      where: { id: req.params.chargId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const item = await ListingAdditionalChargesModel.update({
      where: { id: req.params.chargId, voided: false, listingId },
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

export const purgeListingAdditionalCharge = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const item = await ListingAdditionalChargesModel.delete({
      where: { id: req.params.chargId, voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
