import { invalidateCachedResource } from "@/utils";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import { NextFunction, Request, Response } from "express";
import { PropertiesModel, PropertyStatusHistoryModel } from "../models";

export const getPropertyStatusHostory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.propertyId;
    const results = await PropertyStatusHistoryModel.findMany({
      where: { propertyId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getPropertyStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.propertyId;

    const item = await PropertyStatusHistoryModel.findUniqueOrThrow({
      where: { id: req.params.statusHistoryId, propertyId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const submitForReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.propertyId!;
    const user = req.context?.userId;
    const property = await PropertiesModel.findUniqueOrThrow({
      where: { id: propertyId },
    });
    if (property.status !== "Draft")
      throw new APIException(403, {
        detail: "Operation only allowed for draft properties",
      });
    //TODO validate property info to ensure all required info and propertly entered
    await PropertiesModel.update({
      where: { id: propertyId },
      data: { status: "Pending" },
    });
    const item = await PropertyStatusHistoryModel.create({
      data: {
        propertyId,
        previousStatus: property.status,
        newStatus: "Pending",
        changedBy: user,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });

    invalidateCachedResource(req, () => "/properties");
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const approveProperty = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.propertyId!;
    const user = req.context?.userId;
    const property = await PropertiesModel.findUniqueOrThrow({
      where: { id: propertyId },
    });
    if (property.status !== "Pending")
      throw new APIException(403, {
        detail: "operation alloewed ony for properties pending approval",
      });
    //TODO validate property info to ensure all required info and propertly entered
    await PropertiesModel.update({
      where: { id: propertyId },
      data: { status: "Approved" },
    });
    const item = await PropertyStatusHistoryModel.create({
      data: {
        propertyId,
        previousStatus: property.status,
        newStatus: "Approved",
        changedBy: user,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    invalidateCachedResource(req, () => "/properties");
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
