import {
  amenitiesRouterMiddleware,
  authRouterMiddleware,
  usersRouterMiddleware,
} from "@/controllers";
import { serviceRouterMiddleware } from "@/utils";
import { Router } from "express";

const router = Router();

router.use("/auth", authRouterMiddleware);
router.use("/users", usersRouterMiddleware);
router.use("/amenities", amenitiesRouterMiddleware);
router.use(
  "/relationship-types",
  serviceRouterMiddleware("@hive/properties-service", "/relationship-types")
);
router.use(
  "/attribute-types",
  serviceRouterMiddleware("@hive/properties-service", "/attribute-types")
);
router.use(
  "/categories",
  serviceRouterMiddleware("@hive/properties-service", "/categories")
);
router.use(
  "/properties",
  serviceRouterMiddleware("@hive/properties-service", "/properties")
);
router.use(
  "/icons",
  serviceRouterMiddleware("@hive/suggestion-service", "/icons")
);
router.use(
  "/icon-families",
  serviceRouterMiddleware("@hive/suggestion-service", "/icon-families")
);
export default router;
