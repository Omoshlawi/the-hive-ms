import { Router } from "express";
import {
  addTenancyAgreement,
  deleteTenancyAgreement,
  getTenancyAgreement,
  getTenancyAgreements,
  patchTenancyAgreement,
  purgeTenancyAgreement,
  updateTenancyAgreement,
} from "../controllers/tenancy-agreements";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import additionsChargesRouter from "./agreement-charges";
import participantsRouter from "./agreement-participants";
import serviceClient from "@/services/service-client";
const router = Router({ mergeParams: true });

router.get(
  "/",
  [requireAuthentication(serviceClient), requireContext],
  getTenancyAgreements
);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  addTenancyAgreement
);
router.get(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  getTenancyAgreement
);
router.patch(
  "/:agreementId",
  [
    validateUUIDPathParam("agreementId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  patchTenancyAgreement
);
router.put(
  "/:agreementId",
  [
    validateUUIDPathParam("agreementId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  updateTenancyAgreement
);
router.delete(
  "/:agreementId",
  [
    validateUUIDPathParam("agreementId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  deleteTenancyAgreement
);
router.purge(
  "/:agreementId",
  [
    validateUUIDPathParam("agreementId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  purgeTenancyAgreement
);
router.use(
  "/:agreementId/additional-charges",
  [validateUUIDPathParam("agreementId")],
  additionsChargesRouter
);
router.use(
  "/:agreementId/participants",
  [validateUUIDPathParam("agreementId")],
  participantsRouter
);

export default router;
