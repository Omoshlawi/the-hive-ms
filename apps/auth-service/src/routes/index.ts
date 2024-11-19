import { refreshToken, registerUser } from "@/controllers/credentials-auth";
import { Router } from "express";
import signInRouter from "./signin";
import usersRouter from "./users";

const router = Router();

router.get("/refresh-token", refreshToken);
router.post("/signup", registerUser);
router.use("/signin", signInRouter);
router.use("/users", usersRouter)

export default router;
