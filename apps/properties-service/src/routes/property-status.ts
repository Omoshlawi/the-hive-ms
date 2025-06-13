import { Router } from "express";
import {
  approvePendingProperty,
  getPropertyStatus,
  getPropertyStatusHostory,
  submitDraftPropertyForReview,
} from "../controllers/property-status";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get(
  "/:statusHistoryId",
  [validateUUIDPathParam("statusHistoryId")],
  getPropertyStatus
);
router.get("/", getPropertyStatusHostory);
router.post(
  "/submit",
  [requireContext, requireOrganizationContext(serviceClient)],
  submitDraftPropertyForReview
);
router.post(
  "/approve",
  [requireContext, requireOrganizationContext(serviceClient)],
  approvePendingProperty
);

export default router;
