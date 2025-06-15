import { NextFunction, Request, Response } from "express";
import { ListingMediaModel } from "../models";
import {
  ListingMediaFilterSchema,
  ListingMediaSchema,
} from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getListingMedias = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const validation = await ListingMediaFilterSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { size, tags, ...filters } = validation.data;
    const results = await ListingMediaModel.findMany({
      where: {
        voided: false,
        listingId,
        tags: tags?.length ? { hasSome: tags ?? [] } : undefined,
        ...filters,
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;
    const item = await ListingMediaModel.findUniqueOrThrow({
      where: { id: req.params.mediaId, voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params!.listingId!;
    const validation = await ListingMediaSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingMediaModel.create({
      data: { ...validation.data, listingId, createdBy: req.context!.userId! },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const validation = await ListingMediaSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingMediaModel.update({
      where: { id: req.params.mediaId, voided: false, listingId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const validation = await ListingMediaSchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await ListingMediaModel.update({
      where: { id: req.params.mediaId, voided: false, listingId },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const item = await ListingMediaModel.update({
      where: { id: req.params.mediaId, voided: false, listingId },
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

export const purgeListingMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const listingId = req.params.listingId;

    const item = await ListingMediaModel.delete({
      where: { id: req.params.mediaId, voided: false, listingId },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
