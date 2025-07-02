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
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getTenants);
router.post("/", addTenant);
router.get("/:tenantId", [validateUUIDPathParam("tenantId")], getTenant);
router.patch("/:tenantId", [validateUUIDPathParam("tenantId")], patchTenant);
router.put("/:tenantId", [validateUUIDPathParam("tenantId")], updateTenant);
router.delete("/:tenantId", [validateUUIDPathParam("tenantId")], deleteTenant);
router.purge("/:tenantId", [validateUUIDPathParam("tenantId")], purgeTenant);

export default router;
