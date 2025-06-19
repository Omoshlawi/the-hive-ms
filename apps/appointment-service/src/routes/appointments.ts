import { Router } from "express";
import {
  addAppointment,
  deleteAppointment,
  getAppointment,
  getAppointments,
  patchAppointment,
  purgeAppointment,
  updateAppointment,
} from "../controllers/appointments";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";
import participantRouter from "./appointment-participants";
import resourcesRouter from "./appointment-resources";
const router = Router({ mergeParams: true });

router.get("/", getAppointments);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  addAppointment
);
router.get(
  "/:appointmentId",
  [validateUUIDPathParam("appointmentId")],
  getAppointment
);
router.patch(
  "/:appointmentId",
  [
    validateUUIDPathParam("appointmentId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  patchAppointment
);
router.put(
  "/:appointmentId",
  [
    validateUUIDPathParam("appointmentId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  updateAppointment
);
router.delete(
  "/:appointmentId",
  [
    validateUUIDPathParam("appointmentId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  deleteAppointment
);
router.purge(
  "/:appointmentId",
  [
    validateUUIDPathParam("appointmentId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  purgeAppointment
);

router.use(
  "/:appointmentId/participants",
  [validateUUIDPathParam("appointmentId")],
  participantRouter
);
router.use(
  "/:appointmentId/resources",
  [validateUUIDPathParam("appointmentId")],
  resourcesRouter
);

export default router;
