export type MulterFile = Express.Multer.File;
export type MemoryMulterFile = Pick<
  MulterFile,
  "fieldname" | "mimetype" | "size" | "originalname" | "buffer"
>;
export type DiskMulterFile = Pick<
  MulterFile,
  | "fieldname"
  | "mimetype"
  | "size"
  | "originalname"
  | "destination"
  | "filename"
  | "path"
>;
