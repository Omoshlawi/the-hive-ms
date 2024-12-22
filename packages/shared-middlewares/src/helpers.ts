import pick from "lodash/pick";
import {
  FileOperationError,
  FileSaveOptions,
  MemoryMulterFile,
  SavedFileResponse,
} from "./types";
import { Request } from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { lookup } from "mime-types";

export const objectToFormData = (
  data: { [key: string]: any },
  options: { useIndexOnFiles: boolean } = { useIndexOnFiles: false },
  formData: FormData = new FormData(),
  parentKey?: string
): FormData => {
  for (const key in data) {
    if (key in data) {
      const value = data[key];

      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value !== null && value !== undefined) {
        if (value instanceof Array) {
          value.forEach((val, index) => {
            const nestedFormKey = `${formKey}[${index}]`;

            if (typeof val === "object" && !(val instanceof File)) {
              // Recursively handle nested objects in arrays
              objectToFormData(val, options, formData, nestedFormKey);
            } else {
              // Handle File instances in arrays
              if (val instanceof File) {
                formData.append(
                  options.useIndexOnFiles ? nestedFormKey : formKey,
                  val,
                  val.name
                );
              } else {
                formData.append(nestedFormKey, val);
              }
            }
          });
        } else if (typeof value === "object" && !(value instanceof File)) {
          // Recursively handle nested objects
          objectToFormData(value, options, formData, formKey);
        } else if (value instanceof File) {
          // Handle top-level File instances
          formData.append(formKey, value, value.name);
        } else {
          formData.append(formKey, value as string);
        }
      }
    }
  }
  return formData;
};

export const memoryMulterFileToJSFile = (
  memoryFile: MemoryMulterFile
): File => {
  const uint8Array = Uint8Array.from(memoryFile.buffer);
  const blob = new Blob([uint8Array], { type: memoryFile.mimetype });
  const file = new File([blob], memoryFile.originalname, {
    type: blob.type,
  });
  return file;
};

export const sanitizeHeaders = (req: Request) => {
  const ALLOWED_HEADERS = ["x-access-token", "x-refresh-token"];
  return pick(req.headers ?? {}, ALLOWED_HEADERS);
};

/**
 * Saves a file from Multer memory storage to disk with advanced options
 *
 * @param file - MemoryMulterFile object from Multer
 * @param options - Configuration options for file saving
 * @returns Promise resolving to SavedFileResponse
 *
 * @example
 * // Basic usage
 * const result = await saveFile(file, { basePath: './uploads' });
 *
 * // Using custom filename generator
 * const result = await saveFile(file, {
 *   basePath: './uploads',
 *   generateFilename: (file) => `${Date.now()}-custom-${file.originalname}`
 * });
 *
 * // Advanced usage with custom options
 * const result = await saveFile(file, {
 *   basePath: './uploads',
 *   allowedTypes: ['image/jpeg', 'image/png'],
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   preserveOriginalName: true,
 *   validateFile: async (file) => {
 *     // Custom validation logic
 *     return file.size > 0;
 *   }
 * });
 */
export const saveFile = async (
  file: MemoryMulterFile,
  options: FileSaveOptions = {}
): Promise<SavedFileResponse> => {
  try {
    const {
      basePath = "./uploads",
      allowedTypes,
      maxSize,
      preserveOriginalName = false,
      validateFile,
      processFile,
      generateFilename,
    } = options;

    // Validate file existence
    if (!file || !file.buffer) {
      throw new FileOperationError("No file provided", "NO_FILE");
    }

    // Check file type if allowedTypes specified
    if (allowedTypes && !allowedTypes.includes(file.mimetype)) {
      throw new FileOperationError(
        `File type ${file.mimetype} not allowed. Allowed types: ${allowedTypes.join(", ")}`,
        "INVALID_TYPE"
      );
    }

    // Check file size if maxSize specified
    if (maxSize && file.size > maxSize) {
      throw new FileOperationError(
        `File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`,
        "FILE_TOO_LARGE"
      );
    }

    // Run custom validation if provided
    if (validateFile) {
      const isValid = await validateFile(file);
      if (!isValid) {
        throw new FileOperationError(
          "File validation failed",
          "VALIDATION_FAILED"
        );
      }
    }

    // Generate filename based on provided options
    let fileName: string;
    if (generateFilename) {
      // Use custom filename generator
      fileName = await Promise.resolve(generateFilename(file));
    } else if (preserveOriginalName) {
      // Use original filename
      fileName = file.originalname;
    } else {
      // Use default unique filename generator
      fileName = await generateUniqueFilename(file, basePath);
    }

    // Ensure the generated filename has an extension
    if (!path.extname(fileName)) {
      const ext =
        path.extname(file.originalname) || `.${lookup(file.mimetype) || "bin"}`;
      fileName = `${fileName}${ext}`;
    }

    // Ensure base directory exists
    await fs.mkdir(basePath, { recursive: true });

    // Process file if processor provided
    const fileBuffer = processFile ? await processFile(file) : file.buffer;

    // Save file
    const filePath = path.join(basePath, fileName);
    await fs.writeFile(filePath, fileBuffer);

    return {
      success: true,
      filePath,
      fileName,
      size: fileBuffer.length,
      mimeType: file.mimetype,
    };
  } catch (error) {
    if (error instanceof FileOperationError) {
      return {
        success: false,
        filePath: "",
        fileName: "",
        size: 0,
        mimeType: "",
        error: `${error.code}: ${error.message}`,
      };
    }

    return {
      success: false,
      filePath: "",
      fileName: "",
      size: 0,
      mimeType: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Generates a unique filename for the uploaded file
 */
async function generateUniqueFilename(
  file: MemoryMulterFile,
  basePath: string
): Promise<string> {
  const fileExt =
    path.extname(file.originalname) || `.${lookup(file.mimetype) || "bin"}`;
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const baseFileName = `${timestamp}-${randomString}${fileExt}`;

  // Ensure filename is unique
  try {
    await fs.access(path.join(basePath, baseFileName));
    // If file exists, recursively try again
    return generateUniqueFilename(file, basePath);
  } catch {
    // File doesn't exist, we can use this name
    return baseFileName;
  }
}
