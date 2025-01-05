import { uploadFile, streamFile } from "@/controllers/files";
import { registryAddress, serviceIdentity } from "@/utils";
import { ServiceClient } from "@hive/core-utils";
import {
  memoryFileUploader,
  requireAuthentication,
} from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();
router.use(
  "/upload",
  [
    requireAuthentication(new ServiceClient(registryAddress, serviceIdentity)),
    memoryFileUploader,
  ],
  uploadFile
);
router.use("/stream", streamFile);
export default router;
