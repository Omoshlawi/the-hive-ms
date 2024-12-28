import { uploadFile, streamFile } from "@/controllers/files";
import { memoryFileUploader } from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();
router.use("/upload", [memoryFileUploader], uploadFile);
router.use("/stream", streamFile);
export default router;
