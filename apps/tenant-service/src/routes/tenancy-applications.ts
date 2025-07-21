import { Router } from "express";
import {
  addTenancyApplication,
  deleteTenancyApplication,
  getTenancyApplication,
  getTenancyApplications,
  patchTenancyApplication,
  purgeTenancyApplication,
  updateTenancyApplication,
} from "../controllers/tenancy-applications";
import { validateUUIDPathParam } from "@hive/shared-middlewares";
import coapplicantRouter from "./application-coapplicants";
import referencesrouter from "./application-references";
import statusRouter from "./application-status";
const router = Router({ mergeParams: true });

router.get("/", getTenancyApplications);
router.post("/", addTenancyApplication);
router.get(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  getTenancyApplication
);
router.patch(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  patchTenancyApplication
);
router.put(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  updateTenancyApplication
);
router.delete(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  deleteTenancyApplication
);
router.purge(
  "/:applicationId",
  [validateUUIDPathParam("applicationId")],
  purgeTenancyApplication
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
