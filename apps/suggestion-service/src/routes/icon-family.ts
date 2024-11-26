import { Router } from "express";
import {
  addIconFamily,
  deleteIconFamily,
  getIconFamily,
  getIconFamilies,
  patchIconFamily,
  purgeIconFamily,
  updateIconFamily,
} from "../controllers/icons";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getIconFamilies);
router.post("/", addIconFamily);
router.get(
  "/:iconFamilyId",
  [validateUUIDPathParam("iconFamilyId")],
  getIconFamily
);
router.patch(
  "/:iconFamilyId",
  [validateUUIDPathParam("iconFamilyId")],
  patchIconFamily
);
router.put(
  "/:iconFamilyId",
  [validateUUIDPathParam("iconFamilyId")],
  updateIconFamily
);
router.delete(
  "/:iconFamilyId",
  [validateUUIDPathParam("iconFamilyId")],
  deleteIconFamily
);
router.purge(
  "/:iconFamilyId",
  [validateUUIDPathParam("iconFamilyId")],
  purgeIconFamily
);

export default router;
