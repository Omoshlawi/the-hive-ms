import { Router } from "express";
import rolesRouter from "./roles";
import membershipRouter from "./memberships";
import organizationsRouter from "./organization";
import privilegesRouter from "./privileges";
import rolesPrivilegeRouter from "./role-privilege";
import { requireContext } from "@hive/shared-middlewares";
const router = Router();

router.use("/roles", rolesRouter);
router.use("/organization-membership",[requireContext], membershipRouter);
router.use("/organizations",[requireContext], organizationsRouter);
router.use("/privileges", privilegesRouter);
router.use("/role-privileges", rolesPrivilegeRouter);

export default router;
