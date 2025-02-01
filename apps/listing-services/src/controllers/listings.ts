import { NextFunction, Request, Response } from "express";
import { ListingModel } from "../models";
import { ListingSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await ListingModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ListingModel.findUniqueOrThrow({
      where: { id: req.params.listingId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingModel.create({
      data: {
        ...validation.data,
        saleDetails: {
          create: validation.data.saleDetails,
        },
        rentalDetails: {
          create: validation.data.rentalDetails,
        },
        auctionDetails: {
          create: validation.data.auctionDetails,
        },
        leaseDetails: {
          create: validation.data.leaseDetails,
        },
        createdBy: req.context!.userId,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false },
      data: {
        ...validation.data,
        saleDetails: {
          create: validation.data.saleDetails,
        },
        rentalDetails: {
          create: validation.data.rentalDetails,
        },
        auctionDetails: {
          create: validation.data.auctionDetails,
        },
        leaseDetails: {
          create: validation.data.leaseDetails,
        },
        createdBy: req.context!.userId,
      },,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false },
      data: {
        ...validation.data,
        saleDetails: {
          create: validation.data.saleDetails,
        },
        rentalDetails: {
          create: validation.data.rentalDetails,
        },
        auctionDetails: {
          create: validation.data.auctionDetails,
        },
        leaseDetails: {
          create: validation.data.leaseDetails,
        },
        createdBy: req.context!.userId,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false },
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

export const purgeListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await ListingModel.delete({
      where: { id: req.params.listingId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
