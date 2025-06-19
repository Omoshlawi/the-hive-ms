import { Router } from "express";
import {
  addAppointmentParticipant,
  deleteAppointmentParticipant,
  getAppointmentParticipant,
  getAppointmentParticipants,
  patchAppointmentParticipant,
  purgeAppointmentParticipant,
  updateAppointmentParticipant,
} from "../controllers/appointment-participants";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get("/", getAppointmentParticipants);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  addAppointmentParticipant
);
router.get(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  getAppointmentParticipant
);
router.patch(
  "/:participantId",
  [
    validateUUIDPathParam("participantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  patchAppointmentParticipant
);
router.put(
  "/:participantId",
  [
    validateUUIDPathParam("participantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  updateAppointmentParticipant
);
router.delete(
  "/:participantId",
  [
    validateUUIDPathParam("participantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  deleteAppointmentParticipant
);
router.purge(
  "/:participantId",
  [
    validateUUIDPathParam("participantId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  purgeAppointmentParticipant
);

export default router;
