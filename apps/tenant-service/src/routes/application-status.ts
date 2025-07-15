import {
  approvePendingApplication,
  getApplicationStatusHistorys,
  rejectPendingApplication,
  submitDraftApplicationForReview,
  withdrawApplication,
} from "@/controllers/application-status";
import serviceClient from "@/services/service-client";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
} from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router({ mergeParams: true });
router.get("/", getApplicationStatusHistorys);
router.post(
  "/submit",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  submitDraftApplicationForReview
);
router.post(
  "/approve",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  approvePendingApplication
);
router.post(
  "/reject",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  rejectPendingApplication
);
router.post(
  "/withdraw",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  withdrawApplication
);
export default router;
