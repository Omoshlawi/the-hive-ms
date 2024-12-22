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

export type Context = {
  userId: string;
  organizationId?: string;
  roles?: Array<string>;
};

declare global {
  namespace Express {
    interface Request {
      context?: Context;
    }
  }
}

/**
 * Configuration options for file saving
 */
export interface FileSaveOptions {
  /** Base directory for file storage */
  basePath?: string;
  /** Custom filename generator */
  generateFilename?: (file: MemoryMulterFile) => string | Promise<string>;
  /** Allowed file types (mime types) */
  allowedTypes?: string[];
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Whether to preserve original filename */
  preserveOriginalName?: boolean;
  /** Custom validation function */
  validateFile?: (file: MemoryMulterFile) => Promise<boolean>;
  /** Processing function to transform file before saving */
  processFile?: (file: MemoryMulterFile) => Promise<Buffer>;
}

/**
 * Response interface for saved file
 */
export interface SavedFileResponse {
  success: boolean;
  filePath: string;
  fileName: string;
  size: number;
  mimeType: string;
  error?: string;
}

/**
 * Error class for file-related operations
 */
export class FileOperationError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "FileOperationError";
  }
}
