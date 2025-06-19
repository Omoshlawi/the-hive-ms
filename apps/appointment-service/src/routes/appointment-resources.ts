import { Router } from "express";
import {
  addAppointmentResource,
  deleteAppointmentResource,
  getAppointmentResource,
  getAppointmentResources,
  patchAppointmentResource,
  purgeAppointmentResource,
  updateAppointmentResource,
} from "../controllers/appointment-resources";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get("/", getAppointmentResources);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  addAppointmentResource
);
router.get(
  "/:resourceId",
  [
    validateUUIDPathParam("resourceId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  getAppointmentResource
);
router.patch(
  "/:resourceId",
  [
    validateUUIDPathParam("resourceId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  patchAppointmentResource
);
router.put(
  "/:resourceId",
  [
    validateUUIDPathParam("resourceId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  updateAppointmentResource
);
router.delete(
  "/:resourceId",
  [
    validateUUIDPathParam("resourceId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  deleteAppointmentResource
);
router.purge(
  "/:resourceId",
  [
    validateUUIDPathParam("resourceId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  purgeAppointmentResource
);

export default router;
