import {
  memoryFileUploader,
  requireContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import { Router } from "express";
import {
  addHiveFile,
  cleanHiveFile,
  deleteHiveFile,
  getHiveFile,
  getHiveFiles,
  patchHiveFile,
  purgeHiveFile,
  updateHiveFile,
} from "../controllers/files";

const router = Router({ mergeParams: true });

router.get("/", getHiveFiles);
router.post("/upload", [requireContext, memoryFileUploader], addHiveFile);
router.delete("/clean", [requireContext], cleanHiveFile);
router.get("/:fileId", [validateUUIDPathParam("fileId")], getHiveFile);
router.patch("/:fileId", [validateUUIDPathParam("fileId")], patchHiveFile);
router.put("/:fileId", [validateUUIDPathParam("fileId")], updateHiveFile);
router.delete("/:fileId", [validateUUIDPathParam("fileId")], deleteHiveFile);
router.purge("/:fileId", [validateUUIDPathParam("fileId")], purgeHiveFile);

export default router;
