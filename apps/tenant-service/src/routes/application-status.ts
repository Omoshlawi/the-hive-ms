import {
  approvePendingApplication,
  getApplicationStatusHistorys,
  rejectPendingApplication,
  submitDraftApplicationForReview,
  withdrawApplication,
} from "@/controllers/application-status";
import { Router } from "express";

const router = Router({ mergeParams: true });
router.get("/", getApplicationStatusHistorys);
router.post("/submit", submitDraftApplicationForReview);
router.post("/approve", approvePendingApplication);
router.post("/reject", rejectPendingApplication);
router.post("/withdraw", withdrawApplication);
export default router;
