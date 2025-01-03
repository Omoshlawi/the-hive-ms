import { NextFunction, Request, Response } from "express";
import { PropertiesModel } from "../models";
import { PropertyfiltersSchema, PropertySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
  nullifyExceptionAsync,
  ServiceClient,
} from "@hive/core-utils";
import { registryAddress, serviceIdentity } from "@/utils";
import { sanitizeHeaders } from "@hive/shared-middlewares";
import { Address, OrganizationMembership } from "@/types";

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
    const results = await PropertiesModel.findMany({
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
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
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
    const item = await PropertiesModel.findUniqueOrThrow({
      where: {
        id: req.params.propertyId,
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
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const getAddress = nullifyExceptionAsync(
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
    );
    // Get addresses
    const address = await getAddress();
    // get user organization membership
    const organizationMemberships = await serviceClient.callService<{
      results: OrganizationMembership[];
    }>("@hive/policy-engine-service", {
      method: "GET",
      url: `/organization-membership`,
      params: {
        v: "custom:select(id,organizationId,organization:select(id,name,description))",
        memberUserId: req.context!.userId!,
        organizationId: req.context!.organizationId!,
      },
      headers: sanitizeHeaders(req),
    });

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
        organization: organizationMemberships.results[0].organization,
        address: address as any,
        createdBy: req.context!.userId!,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
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
    const validation = await PropertySchema.pick({
      name: true,
      thumbnail: true,
    }).safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const item = await PropertiesModel.update({
      where: { id: req.params.propertyId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
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
      .pick({ name: true, thumbnail: true })
      .safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertiesModel.update({
      where: { id: req.params.propertyId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
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
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
