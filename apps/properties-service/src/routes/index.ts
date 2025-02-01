import { getDatabaseSchemas } from "@/controllers/db-schema";
import {
  requireContext
} from "@hive/shared-middlewares";
import { Router } from "express";
import { default as amenitiesRouter } from "./amenities";
import { default as attributeTypesRouter } from "./attribute-types";
import { default as categoriesRouter } from "./categories";
import { default as propertiesRouter } from "./properties";
import { default as relationshipTypeRouter } from "./relationship-types";
import relationshipRouter from "./relationships";

const router = Router();
router.get("/resources-schema", [requireContext], getDatabaseSchemas);
router.use("/amenities", [requireContext], amenitiesRouter);
router.use("/attribute-types", [requireContext], attributeTypesRouter);
router.use("/relationship-types", [requireContext], relationshipTypeRouter);
router.use("/categories", [requireContext], categoriesRouter);
router.use("/properties", propertiesRouter);
router.use("/relationships", relationshipRouter);

export default router;
