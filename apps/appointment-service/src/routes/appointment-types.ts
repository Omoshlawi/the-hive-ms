import { Router } from "express";
import {
  addAppointmentType,
  deleteAppointmentType,
  getAppointmentType,
  getAppointmentTypes,
  patchAppointmentType,
  purgeAppointmentType,
  updateAppointmentType,
} from "../controllers/appointment-types";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAppointmentTypes);
router.post("/", addAppointmentType);
router.get(
  "/:appointmentTypeid",
  [validateUUIDPathParam("appointmentTypeid")],
  getAppointmentType
);
router.patch(
  "/:appointmentTypeid",
  [validateUUIDPathParam("appointmentTypeid")],
  patchAppointmentType
);
router.put(
  "/:appointmentTypeid",
  [validateUUIDPathParam("appointmentTypeid")],
  updateAppointmentType
);
router.delete(
  "/:appointmentTypeid",
  [validateUUIDPathParam("appointmentTypeid")],
  deleteAppointmentType
);
router.purge(
  "/:appointmentTypeid",
  [validateUUIDPathParam("appointmentTypeid")],
  purgeAppointmentType
);

export default router;
