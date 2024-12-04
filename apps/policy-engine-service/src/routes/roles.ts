import { Router } from "express";
import {
  addRole,
  deleteRole,
  getRole,
  getRoles,
  patchRole,
  purgeRole,
  updateRole,
} from "../controllers/roles";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getRoles);
router.post("/", addRole);
router.get("/:roleId", [validateUUIDPathParam("roleId")], getRole);
router.patch("/:roleId", [validateUUIDPathParam("roleId")], patchRole);
router.put("/:roleId", [validateUUIDPathParam("roleId")], updateRole);
router.delete("/:roleId", [validateUUIDPathParam("roleId")], deleteRole);
router.purge("/:roleId", [validateUUIDPathParam("roleId")], purgeRole);

export default router;
