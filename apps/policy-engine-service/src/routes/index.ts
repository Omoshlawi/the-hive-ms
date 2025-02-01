import {
  getDatabaseSchemas,
  pullServiceDatabaseSchema,
  sourceServiceDBSchemaToResource,
} from "@/controllers/db-schema";
import {
  requireContext
} from "@hive/shared-middlewares";
import { Router } from "express";
import membershipRouter from "./memberships";
import organizationsRouter from "./organization";
import privilegesRouter from "./privileges";
import resourcesRouter from "./resources";
import rolesPrivilegeRouter from "./role-privilege";
import rolesRouter from "./roles";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.post("/resources-schema", pullServiceDatabaseSchema);
router.post("/resources-schema/source", sourceServiceDBSchemaToResource);
router.use("/resources", resourcesRouter);
router.use("/roles", [requireContext], rolesRouter);
router.use("/organization-membership", [requireContext], membershipRouter);
router.use("/organizations", [requireContext], organizationsRouter);
router.use("/privileges", [requireContext], privilegesRouter);
router.use("/role-privileges", rolesPrivilegeRouter);

export default router;
