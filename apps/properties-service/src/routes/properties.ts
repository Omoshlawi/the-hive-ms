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

export default router;
