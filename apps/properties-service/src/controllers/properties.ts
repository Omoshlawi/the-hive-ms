import serviceClient from "@/services/service-client";
import { Address, OrganizationMembership } from "@/types";
import { getCachedResource, invalidateCachedResource } from "@/utils";
import { PropertyfiltersSchema, PropertySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  nullifyExceptionAsync,
} from "@hive/core-utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { NextFunction, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";
import { PropertiesModel } from "../models";

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyfiltersSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { search } = validation.data;
    const results = await getCachedResource(req, () =>
      PropertiesModel.findMany({
        where: {
          AND: [
            {
              voided: false,
              organizationId: req.context?.organizationId ?? undefined,
            },

            {
              OR: search
                ? [{ name: { contains: search, mode: "insensitive" } }]
                : undefined,
            },
          ],
        },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );
    return res.json({ results: results.data });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      PropertiesModel.findUniqueOrThrow({
        where: {
          id: req.params.propertyId,
          voided: false,
          organizationId: req.context?.organizationId ?? undefined,
        },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );
    return res.json(item.data);
  } catch (error) {
    next(error);
  }
};

export const addProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { attributes, amenities, categories, media, ...propertyAttributes } =
      validation.data;
    const address = await nullifyExceptionAsync(
      async () => {
        const address = await serviceClient.callService<Address>(
          "@hive/suggestion-service",
          {
            method: "GET",
            url: `/addresses/${validation.data.addressId}`,
            params: {
              v: "custom:select(id,name,description,county,subCounty,subCounty,ward,village,landmark,postalCode,latitude,longitude,metadata)",
            },
            headers: sanitizeHeaders(req),
          }
        );
        return address;
      },
      (err: APIException) => {
        if (
          err.status === 404 &&
          (err.errors.detail as string).toLowerCase().startsWith("service")
        ) {
          throw new APIException(400, {
            addressId: { _errors: ["Invalid address"] },
          });
        } else {
          throw err;
        }
      }
    )();

    const item = await PropertiesModel.create({
      data: {
        ...propertyAttributes,
        media: {
          createMany: {
            skipDuplicates: true,
            data: media ?? [],
          },
        },
        amenities: {
          createMany: {
            skipDuplicates: true,
            data: (amenities ?? []).map((amenityId) => ({ amenityId })),
          },
        },
        attributes: {
          createMany: { skipDuplicates: true, data: attributes ?? [] },
        },
        categories: {
          createMany: {
            skipDuplicates: true,
            data: (categories ?? []).map((categoryId) => ({ categoryId })),
          },
        },
        organizationId: req.context!.organizationId!,
        organization: req.context!.organization,
        address: address as any,
        createdBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertySchema.omit({
      media: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const address = await nullifyExceptionAsync(
      async () => {
        const address = await serviceClient.callService<Address>(
          "@hive/suggestion-service",
          {
            method: "GET",
            url: `/addresses/${validation.data.addressId}`,
            params: {
              v: "custom:select(id,name,description,county,subCounty,subCounty,ward,village,landmark,postalCode,latitude,longitude,metadata)",
            },
            headers: sanitizeHeaders(req),
          }
        );
        return address;
      },
      (err: APIException) => {
        if (
          err.status === 404 &&
          (err.errors.detail as string).toLowerCase().startsWith("service")
        ) {
          throw new APIException(400, {
            addressId: { _errors: ["Invalid address"] },
          });
        } else {
          throw err;
        }
      }
    )();
    // Get addresses

    const item = await PropertiesModel.update({
      where: { id: req.params.propertyId, voided: false },
      data: {
        ...validation.data,
        categories: isEmpty(validation.data.categories)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                categoryId: { notIn: validation.data.categories },
              },
              createMany: {
                skipDuplicates: true,
                data: validation.data.categories!.map((categoryId) => ({
                  categoryId,
                })),
              },
            },
        amenities: isEmpty(validation.data.amenities)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                amenityId: { notIn: validation.data.amenities },
              },
              createMany: {
                skipDuplicates: true,
                data: validation.data.amenities!.map((amenityId) => ({
                  amenityId,
                })),
              },
            },
        attributes: isEmpty(validation.data.attributes)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                attributeId: {
                  notIn: validation.data.attributes?.map((a) => a.attributeId),
                },
              },
              createMany: {
                skipDuplicates: true,
                data: validation.data.attributes!,
              },
            },
        address: address as any,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertySchema.partial()
      .omit({
        media: true,
      })
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    let address: Address | null | undefined;
    if (validation.data.addressId) {
      address = await nullifyExceptionAsync(
        async () => {
          const address = await serviceClient.callService<Address>(
            "@hive/suggestion-service",
            {
              method: "GET",
              url: `/addresses/${validation.data.addressId}`,
              params: {
                v: "custom:select(id,name,description,county,subCounty,subCounty,ward,village,landmark,postalCode,latitude,longitude,metadata)",
              },
              headers: sanitizeHeaders(req),
            }
          );
          return address;
        },
        (err: APIException) => {
          if (
            err.status === 404 &&
            (err.errors.detail as string).toLowerCase().startsWith("service")
          ) {
            throw new APIException(400, {
              addressId: { _errors: ["Invalid address"] },
            });
          } else {
            throw err;
          }
        }
      )();
    }

    const item = await PropertiesModel.update({
      where: { id: req.params.propertyId, voided: false },
      data: {
        ...validation.data,
        categories: isEmpty(validation.data.categories)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                categoryId: { notIn: validation.data.categories },
              },
              createMany: {
                skipDuplicates: true,
                data: (validation.data.categories ?? []).map((categoryId) => ({
                  categoryId,
                })),
              },
            },
        amenities: isEmpty(validation.data.amenities)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                amenityId: { notIn: validation.data.amenities },
              },
              createMany: {
                skipDuplicates: true,
                data: (validation.data.amenities ?? []).map((amenityId) => ({
                  amenityId,
                })),
              },
            },
        attributes: isEmpty(validation.data.attributes)
          ? undefined
          : {
              deleteMany: {
                propertyId: req.params.propertyId,
                attributeId: {
                  notIn: validation.data.attributes?.map((a) => a.attributeId),
                },
              },
              createMany: {
                skipDuplicates: true,
                data: validation.data.attributes!,
              },
            },
        address: address as any,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertiesModel.update({
      where: { id: req.params.propertyId, voided: false },
      data: {
        voided: true,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const purgeProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertiesModel.delete({
      where: { id: req.params.propertyId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => req.baseUrl);

    return res.json(item);
  } catch (error) {
    next(error);
  }
};
