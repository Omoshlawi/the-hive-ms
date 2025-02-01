import { NextFunction, Request, Response } from "express";
import { ListingModel } from "../models";
import { ListingSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  nullifyExceptionAsync,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { Property } from "@/types";

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
    const allUnprovided = [
      "saleDetails",
      "rentalDetails",
      "auctionDetails",
      "leaseDetails",
    ];

    if (allUnprovided.every((field) => !(validation.data as any)[field]))
      throw new APIException(400, {
        _errors: ["You must provide atleast " + allUnprovided.join(", ")],
      });

    const property = await nullifyExceptionAsync(
      async () =>
        await serviceClient.callService<Property>("@hive/properties-service", {
          method: "GET",
          url: `/properties/${validation.data.propertyId}`,
          params: {
            v: "custom:include(membershipRoles)",
          },
          headers: sanitizeHeaders(req),
        })
    )();

    if (!property)
      throw new APIException(400, {
        propertyId: { _errors: ["Invalid property"] },
      });

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
        organizationId: req.context!.organizationId!,
        property: property as any,
        organization: req.context?.organization,
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
    const validation = await ListingSchema.omit({
      propertyId: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const allUnprovided = [
      "saleDetails",
      "rentalDetails",
      "auctionDetails",
      "leaseDetails",
    ];

    if (allUnprovided.every((field) => !(validation.data as any)[field]))
      throw new APIException(400, {
        _errors: ["You must provide atleast " + allUnprovided.join(", ")],
      });

    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false },
      data: {
        ...validation.data,
        saleDetails: validation.data.saleDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.saleDetails,
                update: validation.data.saleDetails,
              },
            }
          : undefined,
        rentalDetails: validation.data.rentalDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.rentalDetails,
                update: validation.data.rentalDetails,
              },
            }
          : undefined,
        auctionDetails: validation.data.auctionDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.auctionDetails,
                update: validation.data.auctionDetails,
              },
            }
          : undefined,
        leaseDetails: validation.data.leaseDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.leaseDetails,
                update: validation.data.leaseDetails,
              },
            }
          : undefined,
        createdBy: req.context!.userId,
      },
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
    const validation = await ListingSchema.omit({ propertyId: true })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false },
      data: {
        ...validation.data,
        saleDetails: validation.data.saleDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.saleDetails,
                update: validation.data.saleDetails,
              },
            }
          : undefined,
        rentalDetails: validation.data.rentalDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.rentalDetails,
                update: validation.data.rentalDetails,
              },
            }
          : undefined,
        auctionDetails: validation.data.auctionDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.auctionDetails,
                update: validation.data.auctionDetails,
              },
            }
          : undefined,
        leaseDetails: validation.data.leaseDetails
          ? {
              upsert: {
                where: { listingId: req.params.listingId },
                create: validation.data.leaseDetails,
                update: validation.data.leaseDetails,
              },
            }
          : undefined,
        createdBy: req.context!.userId,
        organizationId: req.context!.organizationId!,
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
