import { getUser, getUserByToken, getUsers } from "@/controllers/users";
import authenticate from "@/middlewares/authentication";
import { Router } from "express";

const router = Router();

router.get("/profile", authenticate, getUserByToken); // Profile has higher priotity to uuid
router.get("/:userId", authenticate, getUser);
router.get("/", authenticate, getUsers);

export default router;
