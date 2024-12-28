import { registryAddress, sanitizeHeaders, serviceIdentity } from "@/utils";
import { APIException, ServiceClient } from "@hive/core-utils";
import {
  MemoryMulterFile,
  memoryMulterFileToJSFile,
  objectToFormData,
} from "@hive/shared-middlewares";
import { NextFunction, Request, Response } from "express";

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = ((req as any).files as Array<MemoryMulterFile>).reduce<
      Record<string, File[]>
    >((prev, file) => {
      const { fieldname } = file;
      return {
        ...prev,
        [fieldname]: prev[fieldname]
          ? [...prev[fieldname], memoryMulterFileToJSFile(file)]
          : [memoryMulterFileToJSFile(file)],
      };
    }, {});
    const data = {
      ...req.body,
      ...files,
    };
    const formData = objectToFormData(data);

    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const response = await serviceClient.callServiceWithResponse(
      "@hive/files-service",
      {
        method: req.method,
        url: `/upload${req.url}`,
        data: formData,
        timeout: 5000,
        headers: sanitizeHeaders(req),
      }
    );

    return res.json(response.data);
  } catch (error) {
    next(error);
  }
};
export const streamFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const serviceClient = new ServiceClient(registryAddress, serviceIdentity);
    const fileStream = await serviceClient.callService<any>(
      "@hive/files-service",
      {
        method: "GET",
        url: `${req.url}`,
        timeout: 5000,
        responseType: "stream",
        headers: sanitizeHeaders(req),
      }
    );
    // Pipe readable fileStream into res writable stream
    fileStream.pipe(res);
    return res;
  } catch (error) {
    next(new APIException(404, { detail: "File not found" }));
  }
};
