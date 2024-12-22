import { Router } from "express";
import { default as amenitiesRouter } from "./amenities";
import { default as attributeTypesRouter } from "./attribute-types";
import { default as relationshipTypeRouter } from "./relationship-types";
import { default as categoriesRouter } from "./categories";
import { default as propertiesRouter } from "./properties";
import { getDatabaseSchemas } from "@/controllers/db-schema";
import {
  requireContext,
  requireOrganizationContext,
} from "@hive/shared-middlewares";

const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/amenities", amenitiesRouter);
router.use("/attribute-types", attributeTypesRouter);
router.use("/relationship-types", relationshipTypeRouter);
router.use("/categories", categoriesRouter);
router.use(
  "/properties",
  [requireContext, requireOrganizationContext],
  propertiesRouter
);

export default router;
