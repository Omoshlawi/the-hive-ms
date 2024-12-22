import pick from "lodash/pick";
import {
  DeleteFileOptions,
  DeleteFileResponse,
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

/**
 * Converts a nested object into FormData, handling Files and arrays.
 *
 * @param data - The object to convert to FormData
 * @param options - Configuration options
 * @param options.useIndexOnFiles - If true, uses array indices in keys for File objects
 * @param formData - Optional existing FormData to append to
 * @param parentKey - Used internally for recursive calls to maintain proper key hierarchy
 *
 * @returns FormData object containing all the data with proper key structure
 *
 * @example
 * const data = {
 *   name: 'John',
 *   files: [file1, file2],
 *   details: {
 *     age: 30,
 *     photo: fileObject
 *   }
 * };
 *
 * const formData = objectToFormData(data, { useIndexOnFiles: true });
 * // Results in FormData with keys like:
 * // - name
 * // - files[0], files[1]
 * // - details[age]
 * // - details[photo]
 */
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

/**
 * Converts a MemoryMulterFile to a standard JavaScript File object.
 *
 * @param memoryFile - The MemoryMulterFile object to convert
 * @returns A standard JavaScript File object containing the same data
 *
 * @example
 * const memoryFile = req.file; // MemoryMulterFile from multer middleware
 * const jsFile = memoryMulterFileToJSFile(memoryFile);
 */
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
    if (options.throwErrors ?? false) {
      throw error;
    }
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
    console.error(
      `[Save File]:${error instanceof Error ? error.message : "Unknown error occurred"}`
    );

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
export async function generateUniqueFilename(
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

/**
 * Deletes a file from the filesystem with advanced error handling
 *
 * @param filePath - Path to the file or just filename if using basePath
 * @param options - Configuration options for file deletion
 * @returns Promise resolving to DeleteFileResponse
 *
 * @example
 * // Basic usage
 * const result = await deleteFile('uploads/example.jpg');
 *
 * // With options
 * const result = await deleteFile('example.jpg', {
 *   basePath: './uploads',
 *   ignoreNonExistent: true,
 *   beforeDelete: async (path) => {
 *     // Custom validation or logging
 *     return true;
 *   }
 * });
 */
export const deleteFile = async (
  filePath: string,
  options: DeleteFileOptions = {}
): Promise<DeleteFileResponse> => {
  try {
    const {
      basePath,
      ignoreNonExistent = false,
      beforeDelete,
      throwErrors = false,
    } = options;

    // Construct full file path
    const fullPath = basePath ? path.join(basePath, filePath) : filePath;

    try {
      // Check if file exists
      await fs.access(fullPath);
    } catch (error) {
      if (ignoreNonExistent) {
        return {
          success: true,
          filePath: fullPath,
        };
      }
      throw new FileOperationError("File does not exist", "FILE_NOT_FOUND");
    }

    // Execute beforeDelete hook if provided
    if (beforeDelete) {
      const shouldProceed = await beforeDelete(fullPath);
      if (!shouldProceed) {
        throw new FileOperationError(
          "Deletion cancelled by beforeDelete hook",
          "DELETION_CANCELLED"
        );
      }
    }

    // Delete the file
    await fs.unlink(fullPath);

    // Check if directory is empty and remove it (if using basePath)
    if (basePath) {
      try {
        const dir = path.dirname(fullPath);
        const files = await fs.readdir(dir);
        if (files.length === 0) {
          await fs.rmdir(dir);
        }
      } catch (error) {
        // Ignore directory deletion errors
      }
    }

    return {
      success: true,
      filePath: fullPath,
    };
  } catch (error) {
    if (options.throwErrors ?? false) {
      throw error;
    }

    if (error instanceof FileOperationError) {
      return {
        success: false,
        filePath: filePath,
        error: `${error.code}: ${error.message}`,
      };
    }

    return {
      success: false,
      filePath: filePath,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

/**
 * Deletes multiple files at once
 *
 * @param filePaths - Array of file paths to delete
 * @param options - Configuration options for file deletion
 * @returns Promise resolving to array of DeleteFileResponse
 *
 * @example
 * const results = await deleteFiles(['file1.jpg', 'file2.pdf'], {
 *   basePath: './uploads',
 *   ignoreNonExistent: true
 * });
 */
export const deleteFiles = async (
  filePaths: string[],
  options: DeleteFileOptions = {}
): Promise<DeleteFileResponse[]> => {
  const deletePromises = filePaths.map((filePath) =>
    deleteFile(filePath, { ...options, throwErrors: false })
  );

  return Promise.all(deletePromises);
};
