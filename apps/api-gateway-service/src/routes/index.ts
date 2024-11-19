import { authRouterMiddleware, usersRouterMiddleware } from "@/controllers";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouterMiddleware);
router.use("/users", usersRouterMiddleware);

export default router;
