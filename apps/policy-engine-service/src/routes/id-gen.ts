import {
  generateIdentifier,
  getIdGeneratorSequence,
} from "@/controllers/id-gen";
import { Router } from "express";

const router = Router();
router.get("/", getIdGeneratorSequence);
router.post("/", generateIdentifier);
export default router;
