import { Router } from "express";
import {
  addTenant,
  deleteTenant,
  getTenant,
  getTenants,
  patchTenant,
  purgeTenant,
  updateTenant,
} from "../controllers/tenants";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get("/", getTenants);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  addTenant
);
router.get("/:tenantId", [validateUUIDPathParam("tenantId")], getTenant);
router.patch(
  "/:tenantId",
  [
    validateUUIDPathParam("tenantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  patchTenant
);
router.put(
  "/:tenantId",
  [
    validateUUIDPathParam("tenantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  updateTenant
);
router.delete(
  "/:tenantId",
  [
    validateUUIDPathParam("tenantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  deleteTenant
);
router.purge(
  "/:tenantId",
  [
    validateUUIDPathParam("tenantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  purgeTenant
);

export default router;
