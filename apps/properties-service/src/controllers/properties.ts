import { NextFunction, Request, Response } from "express";
import { PropertiesModel } from "../models";
import { PropertySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getProperties = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await PropertiesModel.findMany({
      where: { voided: false },
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
      where: { id: req.params.propertyId, voided: false },
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
    const {
      attributes,
      amenities,
      categories,
      location,
      media,
      ...propertyAttributes
    } = validation.data;
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
      organization: true,
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
      .pick({ name: true, organization: true, thumbnail: true })
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
