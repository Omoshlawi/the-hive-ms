import {
  changeOrganizationContext,
  exitContext,
  refreshToken,
  registerUser,
} from "@/controllers/credentials-auth";
import { Router } from "express";
import signInRouter from "./signin";
import usersRouter from "./users";
import authenticate from "@/middlewares/authentication";
import { getDatabaseSchemas } from "@/controllers/db-schema";
import { requireContext } from "@hive/shared-middlewares";

const router = Router();
router.get("/resources-schema", getDatabaseSchemas);
router.get(
  "/change-context/:organizationId",
  authenticate,
  changeOrganizationContext
);
router.delete("/exit-context", [requireContext], exitContext);
router.get("/refresh-token", refreshToken);
router.post("/signup", registerUser);
router.use("/signin", signInRouter);
router.use("/users", usersRouter);

export default router;
