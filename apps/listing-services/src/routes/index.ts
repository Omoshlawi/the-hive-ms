import { getDatabaseSchemas } from "@/controllers/db-schema";
import { Router } from "express";
import listingsRouter from "./listings";

const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/listings", listingsRouter);

export default router;
