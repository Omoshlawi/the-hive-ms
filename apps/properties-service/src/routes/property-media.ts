import { Router } from "express";
import {
  addPropertiesMedia,
  deletePropertiesMedia,
  getPropertiesMedia,
  getPropertiesMedias,
  patchPropertiesMedia,
  purgePropertiesMedia,
  updatePropertiesMedia,
} from "../controllers/property-media";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

//TODO optionally gets context when user is authenticated, Apply more context
router.get("/", getPropertiesMedias);
router.post("/", addPropertiesMedia);
router.get(
  "/:propertyMediaId",
  [validateUUIDPathParam("propertyMediaId")],
  getPropertiesMedia
);
router.patch(
  "/:propertyMediaId",
  [validateUUIDPathParam("propertyMediaId")],
  patchPropertiesMedia
);
router.put(
  "/:propertyMediaId",
  [validateUUIDPathParam("propertyMediaId")],
  updatePropertiesMedia
);
router.delete(
  "/:propertyMediaId",
  [validateUUIDPathParam("propertyMediaId")],
  deletePropertiesMedia
);
router.purge(
  "/:propertyMediaId",
  [validateUUIDPathParam("propertyMediaId")],
  purgePropertiesMedia
);

export default router;
