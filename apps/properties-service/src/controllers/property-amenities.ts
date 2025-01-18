import { NextFunction, Request, Response } from "express";
import { PropertyAmenities } from "../models";
import { PropertyAmenitySchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { getCachedResource } from "@/utils";

export const getPropertyAmenitys = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await getCachedResource(req, () =>
      PropertyAmenities.findMany({
        where: { voided: false },
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

export const getPropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await getCachedResource(req, () =>
      PropertyAmenities.findUniqueOrThrow({
        where: { id: req.params.propertyAmenityId, voided: false },
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

export const addPropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAmenitySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAmenities.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAmenitySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAmenities.update({
      where: { id: req.params.propertyAmenityId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyAmenitySchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyAmenities.update({
      where: { id: req.params.propertyAmenityId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyAmenities.update({
      where: { id: req.params.propertyAmenityId, voided: false },
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

export const purgePropertyAmenity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyAmenities.delete({
      where: { id: req.params.propertyAmenityId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
