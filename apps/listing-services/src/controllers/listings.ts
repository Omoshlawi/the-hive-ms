import { NextFunction, Request, Response } from "express";
import { ListingModel } from "../models";
import {
  ListingFilterSchema,
  ListingSchema,
  SaleListingSchema,
} from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  getPaginationControls,
  nullifyExceptionAsync,
  paginate,
} from "@hive/core-utils";
import serviceClient from "@/services/service-client";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { ListingData, Property } from "@/types";
import logger from "@/services/logger";
import pick from "lodash/pick";
import { ID_GEN_CONFIG } from "@/utils";

const validateTypes = (type: ListingData["type"] | undefined, data: any) => {
  if (type === "RENTAL" && !data.rentalDetails)
    throw new APIException(400, { rentalDetails: { _errors: ["Required"] } });
  if (type === "SALE" && !data.saleDetails)
    throw new APIException(400, { saleDetails: { _errors: ["Required"] } });
  if (type === "AUCTION" && !data.auctionDetails)
    throw new APIException(400, {
      auctionDetails: { _errors: ["Required"] },
    });
  if (type === "LEASE" && !data.leaseDetails)
    throw new APIException(400, { leaseDetails: { _errors: ["Required"] } });
  // TODO Add for other listing types
};

export const getListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await ListingFilterSchema.safeParseAsync({
      ...req.query,
      types: (req.query?.types as string)
        ?.split(",")
        ?.map((type) => type.trim()),
      amenities: (req.query?.amenities as string)
        ?.split(",")
        ?.map((type) => type.trim()),
      tags: (req.query?.tags as string)?.split(",")?.map((type) => type.trim()),
      categories: (req.query?.categories as string)
        ?.split(",")
        ?.map((type) => type.trim()),
    });
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
      // attributes,
    } = validation.data;
    type Args = Parameters<typeof ListingModel.findMany>[0];
    const filters: Args = {
      where: {
        AND: [
          {
            voided: false,
            organizationId: req.context?.organizationId ?? undefined,
            tags: tags
              ? {
                  hasSome: tags,
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
            type: types?.length
              ? {
                  in: types,
                }
              : undefined,
            metadata: amenities
              ? {
                  path: ["amenities"],
                  array_contains: amenities,
                }
              : undefined,
          },
          // ...(attributes?.split(",")?.map((v) => {
          //   const [key, val] = v.split(":");
          //   return {
          //     metadata: {
          //       path: ["attributes", key!.trim()],
          //       equals: val!.trim(),
          //     },
          //   };
          // }) ?? []),
          {
            metadata: categories
              ? {
                  path: ["categories"],
                  array_contains: categories,
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
    };
    const results = await ListingModel.findMany({
      ...filters,
      ...paginate(req.query),
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    const totalCount = await ListingModel.count(pick(filters, "where"));
    return res.json({
      results,
      ...getPaginationControls(req, totalCount),
    });
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
      where: {
        id: req.params.listingId,
        voided: false,
        organizationId: req.context?.organizationId ?? undefined,
      },
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
    const { type } = validation.data;
    validateTypes(type, validation.data);

    const property = await nullifyExceptionAsync(
      async () =>
        await serviceClient.callService<Property>("@hive/properties-service", {
          method: "GET",
          url: `/properties/${validation.data.propertyId}`,
          headers: sanitizeHeaders(req),
          params: {
            v: "custom:select(id,name,status,thumbnail,address,addressId,categories:select(category:select(id,name)),amenities:select(amenity:select(id,name)),attributes:select(value,attribute:select(id,name)))",
          },
        }),
      (err) =>
        logger.error(
          "[Add listing]: Err fetching propertyy from @hive/properties-service: " +
            JSON.stringify(err)
        )
    )();

    if (!property || property.status !== "APPROVED")
      throw new APIException(400, {
        propertyId: { _errors: ["Invalid property"] },
      });
    // generate id
    const { identifier } = await serviceClient.callService<{
      identifier: string;
    }>("@hive/policy-engine-service", {
      url: "/id-gen",
      method: "POST",
      data: { ...ID_GEN_CONFIG.listing },
      headers: sanitizeHeaders(req),
    });
    const item = await ListingModel.create({
      data: {
        ...validation.data,
        listingNumber: identifier,
        additionalCharges: validation.data?.additionalCharges?.length
          ? {
              createMany: {
                data: validation.data.additionalCharges,
                skipDuplicates: true,
              },
            }
          : undefined,
        saleDetails:
          type === "SALE"
            ? {
                create: {
                  ...validation.data.saleDetails!,
                  financingOptions: {
                    createMany: {
                      skipDuplicates: true,
                      data: validation.data.saleDetails!.financingOptions ?? [],
                    },
                  },
                },
              }
            : undefined,
        rentalDetails:
          type === "RENTAL"
            ? {
                create: validation.data.rentalDetails,
              }
            : undefined,
        auctionDetails:
          type === "AUCTION"
            ? {
                create: validation.data.auctionDetails,
              }
            : undefined,
        leaseDetails:
          type === "LEASE"
            ? {
                create: validation.data.leaseDetails,
              }
            : undefined,
        createdBy: req.context!.userId!,
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
      additionalCharges: true,
    })
      .extend({
        saleDetails: SaleListingSchema.omit({
          financingOptions: true,
        }).optional(),
      })
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { type } = validation.data;
    validateTypes(type, validation.data);

    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false, type },
      data: {
        ...validation.data,
        saleDetails:
          type === "SALE"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.saleDetails!,
                },
              }
            : undefined,
        rentalDetails:
          type === "RENTAL"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.rentalDetails!,
                },
              }
            : undefined,
        auctionDetails:
          type === "AUCTION"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.auctionDetails!,
                },
              }
            : undefined,
        leaseDetails:
          type === "LEASE"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.leaseDetails!,
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
    const validation = await ListingSchema.omit({
      propertyId: true,
      additionalCharges: true,
    })
      .extend({
        saleDetails: SaleListingSchema.omit({
          financingOptions: true,
        }).optional(),
      })
      .partial()
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { type } = validation.data;
    validateTypes(type, validation.data);

    const item = await ListingModel.update({
      where: { id: req.params.listingId, voided: false, type },
      data: {
        ...validation.data,
        saleDetails:
          type === "SALE"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.saleDetails!,
                },
              }
            : undefined,
        rentalDetails:
          type === "RENTAL"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.rentalDetails!,
                },
              }
            : undefined,
        auctionDetails:
          type === "AUCTION"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.auctionDetails!,
                },
              }
            : undefined,
        leaseDetails:
          type === "LEASE"
            ? {
                update: {
                  where: { listingId: req.params.listingId },
                  data: validation.data.leaseDetails!,
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
