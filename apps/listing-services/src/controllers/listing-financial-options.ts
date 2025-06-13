import { NextFunction, Request, Response } from "express";
import { SaleListingFinancingOptionsModel } from "../models";
import { SaleListingFinancingOptionSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getSalesListingFinancialOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listingId = req.params.listingId;

  try {
    const results = await SaleListingFinancingOptionsModel.findMany({
      where: { voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const listingId = req.params.listingId;

  try {
    const item = await SaleListingFinancingOptionsModel.findUniqueOrThrow({
      where: { id: req.params.optionId, voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId!;
    const validation = await SaleListingFinancingOptionSchema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await SaleListingFinancingOptionsModel.create({
      data: { ...validation.data, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const validation = await SaleListingFinancingOptionSchema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await SaleListingFinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false, listingId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const validation =
      await SaleListingFinancingOptionSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await SaleListingFinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false, listingId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await SaleListingFinancingOptionsModel.update({
      where: { id: req.params.optionId, voided: false },
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

export const purgeSalesListingFinancialOption = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await SaleListingFinancingOptionsModel.delete({
      where: { id: req.params.optionId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
