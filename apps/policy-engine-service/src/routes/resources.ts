import { Router } from "express";
import {
  addResource,
  deleteResource,
  getResource,
  getResources,
  patchResource,
  purgeResource,
  updateResource,
} from "../controllers/resources";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getResources);
router.post("/", addResource);
router.get("/:resourceId", [validateUUIDPathParam("resourceId")], getResource);
router.patch(
  "/:resourceId",
  [validateUUIDPathParam("resourceId")],
  patchResource
);
router.put(
  "/:resourceId",
  [validateUUIDPathParam("resourceId")],
  updateResource
);
router.delete(
  "/:resourceId",
  [validateUUIDPathParam("resourceId")],
  deleteResource
);
router.purge(
  "/:resourceId",
  [validateUUIDPathParam("resourceId")],
  purgeResource
);

export default router;
