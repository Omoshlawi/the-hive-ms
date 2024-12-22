import multer, { FileFilterCallback } from "multer";
import { Request, RequestHandler, Response } from "express";
import { APIException } from "@hive/core-utils";

const filter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    req.query.fileType === "image" &&
    file.mimetype.split("/")[0] !== "image"
  ) {
    cb(
      new APIException(400, {
        [req.body.fieldName]: {
          _errors: ["Only images are allowed"],
        },
      })
    );
  } else {
    cb(null, true);
  }
};
const upload = multer({
  storage: multer.memoryStorage(),
  // fileFilter: filter
});

export const memoryFileUploader: RequestHandler = upload.any();
