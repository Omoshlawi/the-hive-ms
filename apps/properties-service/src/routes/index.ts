import { Router } from "express";
import { default as amenitiesRouter } from "./amenities";
import { default as attributeTypesRouter } from "./attribute-types";
import { default as relationshipTypeRouter } from "./relationship-types";
import { default as categoriesRouter } from "./categories";

const router = Router();

router.use("/amenities", amenitiesRouter);
router.use("/attribute-types", attributeTypesRouter);
router.use("/relationship-types", relationshipTypeRouter);
router.use("/categories", categoriesRouter);

export default router;
