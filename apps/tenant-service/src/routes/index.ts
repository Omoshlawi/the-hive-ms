import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import tenantsRouter from "./tenants";
import applicationRouter from "./tenancy-applications";
import rentalAgreementRouter from "./tenancy-agreements";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/tenants", tenantsRouter);
router.use("/tenancy-applications", applicationRouter);
router.use("/tenancy-agreements", rentalAgreementRouter);

export default router;
