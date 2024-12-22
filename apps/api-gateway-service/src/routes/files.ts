import { uploadFile } from "@/controllers/files";
import {
    memoryFileUploader
} from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();
router.post("/", [memoryFileUploader], uploadFile);
export default router;
