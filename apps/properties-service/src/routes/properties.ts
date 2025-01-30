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
import {
  optionalContext,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import mediaRouter from "./property-media";
import attributesRouter from "./property-attributes";

const router = Router({ mergeParams: true });
router.get("/", [optionalContext], getProperties);
router.post("/", [requireContext, requireOrganizationContext], addProperty);
router.get(
  "/:propertyId",
  [validateUUIDPathParam("propertyId"), optionalContext],
  getProperty
);
router.patch(
  "/:propertyId",
  [
    validateUUIDPathParam("propertyId"),
    requireContext,
    requireOrganizationContext,
  ],
  patchProperty
);
router.put(
  "/:propertyId",
  [
    validateUUIDPathParam("propertyId"),
    requireContext,
    requireOrganizationContext,
  ],
  updateProperty
);
router.delete(
  "/:propertyId",
  [
    validateUUIDPathParam("propertyId"),
    requireContext,
    requireOrganizationContext,
  ],
  deleteProperty
);
router.purge(
  "/:propertyId",
  [
    validateUUIDPathParam("propertyId"),
    requireContext,
    requireOrganizationContext,
  ],
  purgeProperty
);

router.use(
  "/:propertyId/media",
  [validateUUIDPathParam("propertyId"), optionalContext],
  mediaRouter
);
router.use(
  "/:propertyId/attributes",
  [validateUUIDPathParam("propertyId"), optionalContext],
  attributesRouter
);

export default router;
