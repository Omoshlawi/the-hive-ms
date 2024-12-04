import { Router } from "express";
import {
  addPrivilege,
  deletePrivilege,
  getPrivilege,
  getPrivileges,
  patchPrivilege,
  purgePrivilege,
  updatePrivilege,
} from "../controllers/privileges";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getPrivileges);
router.post("/", addPrivilege);
router.get(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  getPrivilege
);
router.patch(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  patchPrivilege
);
router.put(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  updatePrivilege
);
router.delete(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  deletePrivilege
);
router.purge(
  "/:privilegeId",
  [validateUUIDPathParam("privilegeId")],
  purgePrivilege
);

export default router;
