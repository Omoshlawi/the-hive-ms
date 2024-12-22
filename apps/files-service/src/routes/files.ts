import { Router } from "express";
import {
  addHiveFile,
  deleteHiveFile,
  getHiveFile,
  getHiveFiles,
  patchHiveFile,
  purgeHiveFile,
  updateHiveFile,
} from "../controllers/files";
import {
  fileUploader,
  requireContext,
  uploader,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import { MEDIA_ROOT } from "@/utils";

const router = Router({ mergeParams: true });

router.get("/", getHiveFiles);
router.post(
  "/upload",
  [
    requireContext,
    // fileUploader.diskStorage("draft", MEDIA_ROOT).any(),
    // fileUploader.postUpload(MEDIA_ROOT, "").fields(),
    uploader.memoryFile().any(),
  ],
  addHiveFile
);
router.get("/:fileId", [validateUUIDPathParam("fileId")], getHiveFile);
router.patch("/:fileId", [validateUUIDPathParam("fileId")], patchHiveFile);
router.put("/:fileId", [validateUUIDPathParam("fileId")], updateHiveFile);
router.delete("/:fileId", [validateUUIDPathParam("fileId")], deleteHiveFile);
router.purge("/:fileId", [validateUUIDPathParam("fileId")], purgeHiveFile);

export default router;
