import { Router } from "express";
import { default as iconFamilyRouter } from "./icon-family";
import { default as iconRouter } from "./icons";
import { getDatabaseSchemas } from "@/controllers/db-schema";
import placesRouter from "./locations";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);

router.use("/icon-families", iconFamilyRouter);
router.use("/icons", iconRouter);
router.use("/places", placesRouter);
export default router;
