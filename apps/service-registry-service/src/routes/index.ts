import { NextFunction, Request, Response, Router } from "express";
import { toNumber, toString } from "lodash";
import Registry from "@/services/registry";
import { Service, UnregisteredService } from "@/types";
import { ServiceSchema } from "@/schema";
import { APIException } from "@hive/core-utils";

const router = Router();

const registry = new Registry();

router.put(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.safeParseAsync(req.body);
      if (!validation.success)
        throw new APIException(400, validation.error.format());
      const service = registry.register({
        ...validation.data,
        host: "localhost", // TODO Use host sent by service
      });
      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/de-register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.safeParseAsync(req.body);
      if (!validation.success)
        throw new APIException(400, validation.error.format());
      const service = registry.unregister({
        ...validation.data,
        host: "localhost", // TODO Use host sent by service
      });
      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);
router.post(
  "/find",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await ServiceSchema.pick({
        name: true,
        version: true,
      }).safeParseAsync(req.body);
      if (!validation.success)
        throw new APIException(400, validation.error.format());
      const { name: serviceName, version: serviceVersion } = validation.data;
      const service = registry.get(serviceName, serviceVersion);
      if (!service)
        throw new APIException(404, { detail: "No matching service found!" });
      return res.json(service);
    } catch (e) {
      next(e);
    }
  }
);

router.get(
  "/services",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.json({ results: registry.getServices() });
  }
);

export default router;
