import { MEDIA_ROOT } from "@/utils";
import { FilesCleanSchema, FilesSchema } from "@/utils/validators";
import {
  APIException,
  getMultipleOperationCustomRepresentationQeury,
} from "@hive/core-utils";
import {
  addRollBackTaskToQueue,
  deleteFile,
  deleteFiles,
  FileOperationError,
  MemoryMulterFile,
  saveFile,
} from "@hive/shared-middlewares";
import { HiveFile } from "dist/prisma";
import { NextFunction, Request, Response } from "express";
import path from "path";
import { HiveFilesModel } from "../models";

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
    const files: MemoryMulterFile[] = (req.files ?? []) as MemoryMulterFile[];
    if (files.length === 0)
      throw new APIException(400, {
        _errors: ["You must provide atleast one file"],
      });
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
        maxSize: 5 * 1024 * 1024, //5mbs
      })
    );
    const saveResults = await Promise.allSettled(saveFilesAsync);

    // Add role back cleanup task
    if (!saveResults.every((r) => r.status === "fulfilled")) {
      // TODO Fix rollback tasks
      // addRollBackTaskToQueue(req,
      (async () => {
        const paths = saveResults
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.filePath);
        await deleteFiles(paths, {
          ignoreNonExistent: true,
          throwErrors: false,
        });

        const message = `${paths.join(", ")} Rolled back successfully!`;
        console.log("[File upload]: ", message);

        return message;
      })(); // );
      throw new APIException(
        400,
        saveResults.reduce((prev, curr, index) => {
          if (curr.status === "fulfilled") return prev;
          return {
            ...prev,
            [files[index].fieldname]: {
              _errors:
                curr.reason instanceof FileOperationError
                  ? [`${curr.reason.code}: ${curr.reason.message}`]
                  : [curr.reason?.message ?? "Unknown error occurred"],
            },
          };
        }, {})
      );
    }

    const items = await HiveFilesModel.createManyAndReturn({
      data: saveResults.map(({ value }) => ({
        path: path.join(filePath, preValidation.data.path, value.fileName),
        bytesSize: value.size,
        memeType: value.mimeType,
        organizationId: context?.organizationId, // TODO Add other organization info to cache
        uploadedBy: context.userId!,
      })),
      skipDuplicates: false,
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    return res.json(
      items.reduce<{ [key: string]: HiveFile[] }>((prev, curr, idx) => {
        const fieldName = files[idx].fieldname;
        if (fieldName in prev) {
          return { ...prev, [fieldName]: [...prev[fieldName], curr] };
        }
        return { ...prev, [fieldName]: [curr] };
      }, {})
    );
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

export const cleanHiveFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await FilesCleanSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { paths } = validation.data;
    // Clean from db
    const item = await HiveFilesModel.deleteMany({
      where: { path: { in: paths } },
      ...getMultipleOperationCustomRepresentationQeury(req.query?.v as string),
    });
    // Clean from file system
    await deleteFiles(
      paths.map((path_) => path.join(MEDIA_ROOT, path_)),
      {
        ignoreNonExistent: true,
        throwErrors: false,
      }
    );
    return res.json(item);
  } catch (error) {
    next(error);
  }
};
