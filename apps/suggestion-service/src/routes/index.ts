import { Router } from "express";
import { default as iconFamilyRouter } from "./icon-family";
import { default as iconRouter } from "./icons";
const router = Router();
router.use("/icon-families", iconFamilyRouter);
router.use("/icons", iconRouter);
export default router;
