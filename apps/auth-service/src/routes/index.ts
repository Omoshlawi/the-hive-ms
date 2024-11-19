import { refreshToken, registerUser } from "@/controllers/credentials-auth";
import { Router } from "express";
import signInRouter from "./signin";
const router = Router();

router.post("/signup", registerUser);
router.use("/signin", signInRouter);
router.get("/refresh-token", refreshToken);

export default router;
