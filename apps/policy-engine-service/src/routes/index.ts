import { Router } from "express";
import rolesRouter from "./roles";
import membershipRouter from "./memberships";
import organizationsRouter from "./organization";
import privilegesRouter from "./privileges";
import rolesPrivilegeRouter from "./role-privilege";
const router = Router();

router.use("/roles", rolesRouter);
router.use("/organization-membership", membershipRouter);
router.use("/organizations", organizationsRouter);
router.use("/privileges", privilegesRouter);
router.use("/role-privileges", rolesPrivilegeRouter);

export default router;
