import { NextFunction, Request, Response } from "express";
import { ListingModel } from "../models";
import { ListingFilterSchema, ListingSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  nullifyExceptionAsync,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { ListingType, Property } from "@/types";
import logger from "@/services/logger";
import pick from "lodash/pick";

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingFilterSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const {
      expiryDateEnd,
      expiryDateStart,
      listedDateEnd,
      listedDateStart,
      maxPrice,
      minPrice,
      search,
      status,
      tags,
      types,
      amenities,
      categories,
      attributes,
    } = validation.data;
    const listingTypes = (types?.split(",") ?? []) as ListingType[];
    const results = await ListingModel.findMany({
      where: {
        AND: [
          {
            voided: false,
            organizationId: req.context?.organizationId ?? undefined,
            tags: tags
              ? {
                  hasSome: tags.split(","),
                }
              : undefined,
            price: { gte: minPrice, lte: maxPrice },
            expiryDate: {
              gte: expiryDateStart,
              lte: expiryDateEnd,
            },
            listedDate: {
              gte: listedDateStart,
              lte: listedDateEnd,
            },
            status,
            rentalDetails: listingTypes.includes("rental")
              ? { isNot: null }
              : undefined,
            leaseDetails: listingTypes.includes("lease")
              ? { isNot: null }
              : undefined,
            auctionDetails: listingTypes.includes("auction")
              ? { isNot: null }
              : undefined,
            saleDetails: listingTypes.includes("sale")
              ? { isNot: null }
              : undefined,
            metadata: amenities
              ? {
                  path: ["amenities"],
                  array_contains: amenities?.split(","),
                }
              : undefined,
          },
          ...(attributes?.split(",")?.map((v) => {
            const [key, val] = v.split(":");
            return {
              metadata: {
                path: ["attributes", key.trim()],
                equals: val.trim(),
              },
            };
          }) ?? []),
          {
            metadata: categories
              ? {
                  path: ["categories"],
                  array_contains: categories?.split(","),
                }
              : undefined,
          },

          {
            OR: search
              ? [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                  { property: { path: ["name"], string_contains: search } },
                  {
                    property: {
                      path: ["description"],
                      string_contains: search,
                    },
                  },
                ]
              : undefined,
          },
        ],
      },
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
          headers: sanitizeHeaders(req),
          params: {
            v: "custom:select(id,name,thumbnail,address,addressId,categories:select(category:select(id,name)),amenities:select(amenity:select(id,name)),attributes:select(value,attribute:select(id,name)))",
          },
        }),
      (err) =>
        logger.error(
          "[Add listing]: Err fetching propertyy from @hive/properties-service: " +
            JSON.stringify(err)
        )
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
        property: pick(property, [
          "id",
          "name",
          "thumbnail",
          "addrressId",
          "address",
        ]) as any,
        organization: req.context?.organization,
        metadata: {
          amenities: property.amenities.reduce<Array<string>>(
            (acc, cur) => [...acc, cur.amenity.name, cur.amenity.id],
            []
          ),
          categories: property.categories.reduce<Array<string>>(
            (acc, cur) => [...acc, cur.category.name, cur.category.id],
            []
          ),
          attributes: property.attributes.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.attribute.id]: curr.value,
              [curr.attribute.name]: curr.value,
            }),
            {}
          ),
        },
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
