import { getUser, getUserByToken, getUsers } from "@/controllers/users";
import authenticate from "@/middlewares/authentication";
import { Router } from "express";

const router = Router();

router.get("/", authenticate, getUsers);
router.get("/profile", authenticate, getUserByToken); // Profile has higher priotity to uuid
router.get("/:userId", authenticate, getUser);

export default router;
