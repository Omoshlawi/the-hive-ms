import { Router } from "express";
import fileRouter from "./files";
const router = Router();
router.use("/", fileRouter);
export default router;
