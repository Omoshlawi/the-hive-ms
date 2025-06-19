import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import appointmentsRouter from "./appointments";
import appointmentTypesRouter from "./appointment-types";

const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/appointments", appointmentsRouter);
router.use("/appointment-types", appointmentTypesRouter);

export default router;
