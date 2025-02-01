import { streamFile, uploadFile } from "@/controllers/files";
import serviceClient from "@/services/service-client";
import {
  memoryFileUploader,
  requireAuthentication,
} from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();
router.use(
  "/upload",
  [requireAuthentication(serviceClient), memoryFileUploader],
  uploadFile
);
router.use("/stream", streamFile);
export default router;
