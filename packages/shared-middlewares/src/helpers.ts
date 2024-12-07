import pick from "lodash/pick";
import { MemoryMulterFile } from "./types";
import { Request } from "express";

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
