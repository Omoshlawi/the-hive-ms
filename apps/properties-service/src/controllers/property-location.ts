import { NextFunction, Request, Response } from "express";
import { PropertyLocationsModel } from "../models";
import { PropertyLocation } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getPropertLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await PropertyLocationsModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getPropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyLocationsModel.findUniqueOrThrow({
      where: { id: req.params.propertyLocationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addPropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyLocation.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyLocationsModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updatePropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyLocation.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyLocationsModel.update({
      where: { id: req.params.propertyLocationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchPropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await PropertyLocation.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await PropertyLocationsModel.update({
      where: { id: req.params.propertyLocationId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deletePropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyLocationsModel.update({
      where: { id: req.params.propertyLocationId, voided: false },
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

export const purgePropertLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await PropertyLocationsModel.delete({
      where: { id: req.params.propertyLocationId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
