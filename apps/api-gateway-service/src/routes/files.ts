import { uploadFile } from "@/controllers/files";
import { fileUploader, uploader } from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();
router.post("/", [uploader.memoryFile().any()], uploadFile);
export default router;
