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

const router = Router();

router.get(
  "/change-context/:organizationId",
  authenticate,
  changeOrganizationContext
);
router.delete("/exit-context", authenticate, exitContext);
router.get("/refresh-token", refreshToken);
router.post("/signup", registerUser);
router.use("/signin", signInRouter);
router.use("/users", usersRouter);

export default router;
