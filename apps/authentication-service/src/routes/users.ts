import { getUserByToken } from "@/controllers/users";
import authenticate from "@/middlewares/authentication";
import { Router } from "express";

const router = Router();

router.get("/profile", authenticate, getUserByToken);

export default router;
