import { Request } from "express";
import pick from "lodash/pick";

export const sanitizeHeaders = (req: Request) => {
  const ALLOWED_HEADERS = ["x-access-token", "x-refresh-token"];
  return pick(req.headers ?? {}, ALLOWED_HEADERS);
};
