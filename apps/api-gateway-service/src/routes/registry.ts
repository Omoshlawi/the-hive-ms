import { Router } from "express";
import { getServices } from "@/controllers/registry";

const router = Router();
router.get("/services", getServices);
export default router;
