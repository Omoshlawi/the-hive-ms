import { ListingModel, ListingStatusModel } from "@/models";
import { APIException } from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";

export const submitDraftListingForReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId!;
    const listing = await ListingModel.findUniqueOrThrow({
      where: { id: listingId, voided: false },
    });
    if (listing.status !== "DRAFT")
      throw new APIException(403, {
        detail: "operation only permited on DRAFT listings",
      });
    // TODO Perfome further validation on listing ensuring all mandatory fields are provided
    await ListingModel.update({
      where: { id: listingId },
      data: { status: "PENDING" },
    });
    const status = await ListingStatusModel.create({
      data: {
        previousStatus: "DRAFT",
        newStatus: "PENDING",
        changedBy: req.context!.userId!,
        listingId,
      },
    });
    return res.json(status);
  } catch (error) {
    next(error);
  }
};
export const approvePendingListing = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId!;
    const listing = await ListingModel.findUniqueOrThrow({
      where: { id: listingId, voided: false },
    });
    if (listing.status !== "PENDING")
      throw new APIException(403, {
        detail: "operation only permited on PENDING listings",
      });
    // TODO Perfome further validation on listing
    await ListingModel.update({
      where: { id: listingId, voided: false, status: "PENDING" },
      data: { status: "APPROVED" },
    });
    const status = await ListingStatusModel.create({
      data: {
        previousStatus: "PENDING",
        newStatus: "APPROVED",
        changedBy: req.context!.userId!,
        listingId,
      },
    });
    return res.json(status);
  } catch (error) {
    next(error);
  }
};
