import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import tenantsRouter from "./tenants";
import applicationRouter from "./rental-application";
import rentalAgreementRouter from "./rental-agreement";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/tenants", tenantsRouter);
router.use("/rental-applications", applicationRouter);
router.use("/rental-agreement", rentalAgreementRouter);

export default router;
