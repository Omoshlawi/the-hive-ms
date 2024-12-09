import { Router } from "express";
import fileRouter from "./files";
import { getDatabaseSchemas } from "@/controllers/db-schema";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.use("/", fileRouter);
export default router;
