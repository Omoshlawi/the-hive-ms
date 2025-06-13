import {
  approvePendingListing,
  submitDraftListingForReview,
} from "@/controllers/listing-status";
import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/submit", submitDraftListingForReview);
router.post("/approve", approvePendingListing);

export default router;
