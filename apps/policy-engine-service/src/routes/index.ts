import { Router } from "express";
import rolesRouter from "./roles";
import membershipRouter from "./memberships";
import organizationsRouter from "./organization";
import privilegesRouter from "./privileges";
import rolesPrivilegeRouter from "./role-privilege";
import resourcesRouter from "./resources";
import { requireContext } from "@hive/shared-middlewares";
import {
  getDatabaseSchemas,
  pullServiceDatabaseSchema,
  sourceServiceDBSchemaToResource,
} from "@/controllers/db-schema";
const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.post("/resources-schema", pullServiceDatabaseSchema);
router.post("/resources-schema/source", sourceServiceDBSchemaToResource);
router.use("/resources", resourcesRouter);
router.use("/roles", rolesRouter);
router.use("/organization-membership", [requireContext], membershipRouter);
router.use("/organizations", [requireContext], organizationsRouter);
router.use("/privileges", privilegesRouter);
router.use("/role-privileges", rolesPrivilegeRouter);

export default router;
