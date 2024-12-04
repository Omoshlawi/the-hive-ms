import { Router } from "express";
import {
  addOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizations,
  patchOrganization,
  purgeOrganization,
  updateOrganization,
} from "../controllers/organizations";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getOrganizations);
router.post("/", addOrganization);
router.get(
  "/:organizationId",
  [validateUUIDPathParam("organizationId")],
  getOrganization
);
router.patch(
  "/:organizationId",
  [validateUUIDPathParam("organizationId")],
  patchOrganization
);
router.put(
  "/:organizationId",
  [validateUUIDPathParam("organizationId")],
  updateOrganization
);
router.delete(
  "/:organizationId",
  [validateUUIDPathParam("organizationId")],
  deleteOrganization
);
router.purge(
  "/:organizationId",
  [validateUUIDPathParam("organizationId")],
  purgeOrganization
);

export default router;
