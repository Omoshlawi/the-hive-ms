import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import listingsRouter from "./listings";
import financingOptionsRouter from "./financing-options";
import ownershipTypesRouter from "./ownership-types";

const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/listings", listingsRouter);
router.use("/financing-options", financingOptionsRouter);
router.use("/ownership-types", ownershipTypesRouter);

export default router;
