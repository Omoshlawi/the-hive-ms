import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategorys,
  patchCategory,
  purgeCategory,
  updateCategory,
} from "../controllers/categories";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getCategorys);
router.post("/", addCategory);
router.get("/:categoryId", [validateUUIDPathParam("categoryId")], getCategory);
router.patch(
  "/:categoryId",
  [validateUUIDPathParam("categoryId")],
  patchCategory
);
router.put(
  "/:categoryId",
  [validateUUIDPathParam("categoryId")],
  updateCategory
);
router.delete(
  "/:categoryId",
  [validateUUIDPathParam("categoryId")],
  deleteCategory
);
router.purge(
  "/:categoryId",
  [validateUUIDPathParam("categoryId")],
  purgeCategory
);

export default router;
