import { Router } from "express";
import {
  addPropertyAttribute,
  deletePropertyAttribute,
  getPropertyAttribute,
  getPropertyAttributes,
  patchPropertyAttribute,
  purgePropertyAttribute,
  updatePropertyAttribute,
} from "../controllers/property-attributes";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getPropertyAttributes);
router.post("/", addPropertyAttribute);
router.get(
  "/:propertyAttributeId",
  [validateUUIDPathParam("propertyAttributeId")],
  getPropertyAttribute
);
router.patch(
  "/:propertyAttributeId",
  [validateUUIDPathParam("propertyAttributeId")],
  patchPropertyAttribute
);
router.put(
  "/:propertyAttributeId",
  [validateUUIDPathParam("propertyAttributeId")],
  updatePropertyAttribute
);
router.delete(
  "/:propertyAttributeId",
  [validateUUIDPathParam("propertyAttributeId")],
  deletePropertyAttribute
);
router.purge(
  "/:propertyAttributeId",
  [validateUUIDPathParam("propertyAttributeId")],
  purgePropertyAttribute
);

export default router;
