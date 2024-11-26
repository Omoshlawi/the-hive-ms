import { Router } from "express";
import {
  addProperty,
  deleteProperty,
  getProperty,
  getProperties,
  patchProperty,
  purgeProperty,
  updateProperty,
} from "../controllers/properties";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getProperties);
router.post("/", addProperty);
router.get("/:propertyId", [validateUUIDPathParam("propertyId")], getProperty);
router.patch(
  "/:propertyId",
  [validateUUIDPathParam("propertyId")],
  patchProperty
);
router.put(
  "/:propertyId",
  [validateUUIDPathParam("propertyId")],
  updateProperty
);
router.delete(
  "/:propertyId",
  [validateUUIDPathParam("propertyId")],
  deleteProperty
);
router.purge(
  "/:propertyId",
  [validateUUIDPathParam("propertyId")],
  purgeProperty
);

export default router;
