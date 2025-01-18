import { getCachedResource, invalidateCachedResource } from "@/utils";
import { AmenitySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { AmenitiesModel } from "../models";

export const getAmenities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getCachedResource(req, () =>
      AmenitiesModel.findMany({
        where: { voided: false },
        ...getMultipleOperationCustomRepresentationQeury(
          req.query?.v as string
        ),
      })
    );

    return res.json({ results: data.data, ...data.metadata });
  } catch (error) {
    next(error);
  }
};

export const getAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      AmenitiesModel.findUniqueOrThrow({
        where: { id: req.params.amenityId, voided: false },
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

export const addAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AmenitySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AmenitiesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AmenitySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AmenitiesModel.update({
      where: { id: req.params.amenityId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req); //iNVALIDATE CACHE
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await AmenitySchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await AmenitiesModel.update({
      where: { id: req.params.amenityId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AmenitiesModel.update({
      where: { id: req.params.amenityId, voided: false },
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

export const purgeAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await AmenitiesModel.delete({
      where: { id: req.params.amenityId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
