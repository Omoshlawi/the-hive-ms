import { NextFunction, Request, Response } from "express";
import { HiveFilesModel } from "../models";
import { FilesSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import {
  MemoryMulterFile,
  memoryMulterFileToJSFile,
} from "@hive/shared-middlewares";

export const getHiveFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const results = await HiveFilesModel.findMany({
      where: { voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({ results });
  } catch (error) {
    next(error);
  }
};

export const getHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await HiveFilesModel.findUniqueOrThrow({
      where: { id: req.params.fileId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const addHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files: MemoryMulterFile[] = req.files as MemoryMulterFile[];
    const fieldsData = req.body;

    const validation = await FilesSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { organizationId, ...data } = validation.data;
    const item = await HiveFilesModel.create({
      data: {
        ...data,
        organization: { id: organizationId }, // TODO Add other organization info tp cache
      },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const updateHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FilesSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await HiveFilesModel.update({
      where: { id: req.params.fileId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const patchHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FilesSchema.partial().safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const item = await HiveFilesModel.update({
      where: { id: req.params.fileId, voided: false },
      data: validation.data,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await HiveFilesModel.update({
      where: { id: req.params.fileId, voided: false },
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

export const purgeHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await HiveFilesModel.delete({
      where: { id: req.params.fileId, voided: false },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
