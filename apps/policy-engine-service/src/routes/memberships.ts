import serviceClient from "@/services/service-client";
import {
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import { Router } from "express";
import {
  addOrganizationMembership,
  deleteOrganizationMembership,
  getOrganizationMembership,
  getOrganizationMemberships,
  patchOrganizationMembership,
  purgeOrganizationMembership,
  updateOrganizationMembership,
} from "../controllers/membershisps";

const router = Router({ mergeParams: true });
// Has context info
router.get("/", getOrganizationMemberships);
router.post(
  "/",
  [requireOrganizationContext(serviceClient, true)],
  addOrganizationMembership
);
router.get(
  "/:membershipId",
  [validateUUIDPathParam("membershipId")],
  getOrganizationMembership
);
router.patch(
  "/:membershipId",
  [validateUUIDPathParam("membershipId")],
  patchOrganizationMembership
);
router.put(
  "/:membershipId",
  [validateUUIDPathParam("membershipId")],
  updateOrganizationMembership
);
router.delete(
  "/:membershipId",
  [validateUUIDPathParam("membershipId")],
  deleteOrganizationMembership
);
router.purge(
  "/:membershipId",
  [validateUUIDPathParam("membershipId")],
  purgeOrganizationMembership
);

export default router;
