import { NextFunction, Request, Response } from "express";
import { HiveFilesModel } from "../models";
import { FilesSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import {
  addRollBackTaskToQueue,
  deleteFiles,
  FileOperationError,
  MemoryMulterFile,
  memoryMulterFileToJSFile,
  saveFile,
} from "@hive/shared-middlewares";
import path from "path";
import { MEDIA_ROOT } from "@/utils";
import { HiveFile } from "dist/prisma";

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
    const context = req.context!;
    const preValidation = await FilesSchema.safeParse(req.body);
    if (!preValidation.success)
      throw new APIException(400, preValidation.error.format());
    const filePath = context?.organizationId
      ? `organizations/${context.organizationId}` // If has org context then save in org dir
      : "uploads"; // If not in org context upload in uploads
    const saveFilesAsync = files.map((file) =>
      saveFile(file, {
        basePath: path.join(MEDIA_ROOT, filePath, preValidation.data.path),
        throwErrors: true,
      })
    );
    const saveResults = await Promise.allSettled(saveFilesAsync);

    // Add role back cleanup task
    if (!saveResults.every((r) => r.status === "fulfilled")) {
      addRollBackTaskToQueue(req, async () => {
        const paths = saveResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.filePath);
        await deleteFiles(paths, {
          ignoreNonExistent: true,
          throwErrors: false,
        });
        return `${paths.join(", ")} Rolled back successfully!`;
      });
      throw new APIException(
        400,
        saveResults.reduce((prev, curr, index) => {
          if (curr.status === "fulfilled") return prev;
          return {
            ...prev,
            [files[index].fieldname]:
              curr.reason instanceof FileOperationError
                ? `${curr.reason.code}: ${curr.reason.message}`
                : (curr.reason?.message ?? "Unknown error occurred"),
          };
        }, {})
      );
    }

    const items = await HiveFilesModel.createManyAndReturn({
      data: saveResults.map(({ value }) => ({
        path: path.join(filePath, preValidation.data.path, value.fileName),
        organizationId: context?.organizationId, // TODO Add other organization info to cache
        uploadedBy: context.userId!,
      })),
      skipDuplicates: false,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json({
      results: items.reduce<{ [key: string]: HiveFile[] }>(
        (prev, curr, idx) => {
          const fieldName = files[idx].fieldname;
          if (fieldName in prev) {
            return { ...prev, [fieldName]: [...prev[fieldName], curr] };
          }
          return { ...prev, [fieldName]: [curr] };
        },
        {}
      ),
    });
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
