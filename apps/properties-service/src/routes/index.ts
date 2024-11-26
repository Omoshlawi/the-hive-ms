import { Router } from "express";
import { default as amenitiesRouter } from "./amenities";
import { default as attributeTypesRouter } from "./attribute-types";
import { default as relationshipTypeRouter } from "./relationship-types";
import { default as categoriesRouter } from "./categories";
import { default as propertiesRouter } from "./properties";

const router = Router();

router.use("/amenities", amenitiesRouter);
router.use("/attribute-types", attributeTypesRouter);
router.use("/relationship-types", relationshipTypeRouter);
router.use("/categories", categoriesRouter);
router.use("/properties", propertiesRouter);

export default router;
