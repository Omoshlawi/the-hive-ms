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
router.get("/resources-schema", [requireContext], getDatabaseSchemas);
router.use("/amenities", [requireContext], amenitiesRouter);
router.use("/attribute-types", [requireContext], attributeTypesRouter);
router.use("/relationship-types", [requireContext], relationshipTypeRouter);
router.use("/categories", [requireContext], categoriesRouter);
router.use(
  "/properties",
  propertiesRouter
);

export default router;
