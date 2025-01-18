import { ServiceSchema } from "@/schema";
// import { MemoryStorage, RedisStorage, Registry } from "@/services/registry";
import { APIException } from "@hive/core-utils";
import { NextFunction, Request, Response, Router } from "express";
import registry from "@/services/registry";
// import Reg from "@/services/registry-legacy";

const router = Router();

// const registry = new Reg();

/**
 * Register a new service
 * PUT /register
 */
router.put(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.safeParseAsync(req.body);
      if (!validation.success) {
        throw new APIException(400, validation.error.format());
      }

      const service = await registry.register({
        ...validation.data,
        host: "localhost", // TODO Use host sent by service
      });

      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Deregister a service
 * POST /de-register
 */
router.post(
  "/de-register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.safeParseAsync(req.body);
      if (!validation.success) {
        throw new APIException(400, validation.error.format());
      }

      const service = await registry.unregister({
        ...validation.data,
        host: "localhost", // TODO Use host sent by service
      });

      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Find a service by name and version
 * POST /find
 */
router.post(
  "/find",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.pick({
        name: true,
        version: true,
      }).safeParseAsync(req.body);

      if (!validation.success) {
        throw new APIException(400, validation.error.format());
      }

      const { name: serviceName, version: serviceVersion } = validation.data;
      const service = await registry.get(serviceName, serviceVersion);

      if (!service) {
        throw new APIException(404, { detail: "No matching service found!" });
      }

      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * Get all registered services
 * GET /services
 */
router.get(
  "/services",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const services = await registry.getServices();
      return res.json({ results: services });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
