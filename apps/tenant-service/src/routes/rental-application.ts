import { Router } from "express";
import {
  addRentalApplication,
  deleteRentalApplication,
  getRentalApplication,
  getRentalApplications,
  patchRentalApplication,
  purgeRentalApplication,
  updateRentalApplication,
} from "../controllers/rental-applications";
import { validateUUIDPathParam } from "@hive/shared-middlewares";
import coapplicantRouter from "./application-coapplicants";
import referencesrouter from "./application-references";
import statusRouter from "./application-status";
const router = Router({ mergeParams: true });

router.get("/", getRentalApplications);
router.post("/", addRentalApplication);
router.get(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  getRentalApplication
);
router.patch(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  patchRentalApplication
);
router.put(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  updateRentalApplication
);
router.delete(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  deleteRentalApplication
);
router.purge(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  purgeRentalApplication
);
router.use(
  "/:applicationId/co-applicants",
  [validateUUIDPathParam("applicationId")],
  coapplicantRouter
);
router.use(
  "/:applicationId/references",
  [validateUUIDPathParam("applicationId")],
  referencesrouter
);
router.use(
  "/:applicationId/status",
  [validateUUIDPathParam("applicationId")],
  statusRouter
);
export default router;
