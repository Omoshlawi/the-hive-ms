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
router.get("/:typeId", [validateUUIDPathParam("typeId")], getAppointmentType);
router.patch(
  "/:typeId",
  [validateUUIDPathParam("typeId")],
  patchAppointmentType
);
router.put(
  "/:typeId",
  [validateUUIDPathParam("typeId")],
  updateAppointmentType
);
router.delete(
  "/:typeId",
  [validateUUIDPathParam("typeId")],
  deleteAppointmentType
);
router.purge(
  "/:typeId",
  [validateUUIDPathParam("typeId")],
  purgeAppointmentType
);

export default router;
