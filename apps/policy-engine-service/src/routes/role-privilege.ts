import { Router } from "express";
import {
  addRolePrivilege,
  deleteRolePrivilege,
  getRolePrivilege,
  getRolePrivileges,
  patchRolePrivilege,
  purgeRolePrivilege,
  updateRolePrivilege,
} from "../controllers/role-privileges";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getRolePrivileges);
router.post("/", addRolePrivilege);
router.get(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  getRolePrivilege
);
router.patch(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  patchRolePrivilege
);
router.put(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  updateRolePrivilege
);
router.delete(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  deleteRolePrivilege
);
router.purge(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  purgeRolePrivilege
);

export default router;
