import { NextFunction, Request, Response } from "express";
import { IconFamiliesModel, IconsModel } from "../models";
import { IconFamilySchema, IconSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";

export const getIcons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await IconsModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconsModel.findUniqueOrThrow({
      where: { id: req.params.iconId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconsModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconsModel.update({
      where: { id: req.params.iconId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconsModel.update({
      where: { id: req.params.iconId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconsModel.update({
      where: { id: req.params.iconId, voided: false },
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

export const purgeIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconsModel.delete({
      where: { id: req.params.iconId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const getIconFamilies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await IconFamiliesModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconFamiliesModel.findUniqueOrThrow({
      where: { id: req.params.iconFamilyId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconFamilySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconFamiliesModel.create({
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconFamilySchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconFamiliesModel.update({
      where: { id: req.params.iconFamilyId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await IconFamilySchema.partial().safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await IconFamiliesModel.update({
      where: { id: req.params.iconFamilyId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconFamiliesModel.update({
      where: { id: req.params.iconFamilyId, voided: false },
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

export const purgeIconFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await IconFamiliesModel.delete({
      where: { id: req.params.iconFamilyId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
