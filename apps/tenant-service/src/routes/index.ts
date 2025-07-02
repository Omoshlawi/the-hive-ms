import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import tenantsRouter from "./tenants";
import applicationRouter from "./rental-application";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/tenants", tenantsRouter);
router.use("/rental-applications", applicationRouter);

export default router;
