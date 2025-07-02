import { Router } from "express";
import {
  addApplicationTenantReference,
  deleteApplicationTenantReference,
  getApplicationTenantReference,
  getApplicationTenantReferences,
  patchApplicationTenantReference,
  purgeApplicationTenantReference,
  updateApplicationTenantReference,
} from "../controllers/application-references";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getApplicationTenantReferences);
router.post("/", addApplicationTenantReference);
router.get(
  "/:referenceId",
  [validateUUIDPathParam("referenceId")],
  getApplicationTenantReference
);
router.patch(
  "/:referenceId",
  [validateUUIDPathParam("referenceId")],
  patchApplicationTenantReference
);
router.put(
  "/:referenceId",
  [validateUUIDPathParam("referenceId")],
  updateApplicationTenantReference
);
router.delete(
  "/:referenceId",
  [validateUUIDPathParam("referenceId")],
  deleteApplicationTenantReference
);
router.purge(
  "/:referenceId",
  [validateUUIDPathParam("referenceId")],
  purgeApplicationTenantReference
);

export default router;
