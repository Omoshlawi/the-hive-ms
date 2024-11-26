import { Router } from "express";
import {
  addIcon,
  deleteIcon,
  getIcon,
  getIcons,
  patchIcon,
  purgeIcon,
  updateIcon,
} from "../controllers/icons";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getIcons);
router.post("/", addIcon);
router.get("/:iconId", [validateUUIDPathParam("iconId")], getIcon);
router.patch("/:iconId", [validateUUIDPathParam("iconId")], patchIcon);
router.put("/:iconId", [validateUUIDPathParam("iconId")], updateIcon);
router.delete("/:iconId", [validateUUIDPathParam("iconId")], deleteIcon);
router.purge("/:iconId", [validateUUIDPathParam("iconId")], purgeIcon);

export default router;


