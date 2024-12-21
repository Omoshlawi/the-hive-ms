import { getUser, getUserByToken, getUsers } from "@/controllers/users";
import authenticate from "@/middlewares/authentication";
import { requireContext } from "@hive/shared-middlewares";
import { Router } from "express";

const router = Router();

router.get("/", [requireContext], getUsers);
router.get("/profile", authenticate, getUserByToken); // Profile has higher priotity to uuid
router.get("/:userId", [requireContext], getUser);

export default router;
