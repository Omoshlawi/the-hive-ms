import { NextFunction, Request, Response, Router } from "express";
import { toNumber, toString } from "lodash";
import Registry from "@/services/registry";
import { Service, UnregisteredService } from "@/types";

const router = Router();

const registry = new Registry();

const parseService = (req: Request): UnregisteredService => {
  const { serviceName, serviceVersion, servicePort } = req.params;
  const senderHost = req.ip;
  return {
    host: "localhost" /*toString(senderHost)*/,
    name: toString(serviceName),
    port: toNumber(servicePort),
    version: toString(serviceVersion),
  };
};

router.put(
  "/register/:serviceName/:serviceVersion/:servicePort",
  async (req: Request, res: Response, next: NextFunction) => {
    const service = registry.register(parseService(req));
    return res.json({ service });
  }
);

router.delete(
  "/register/:serviceName/:serviceVersion/:servicePort",
  async (req: Request, res: Response, next: NextFunction) => {
    const service = registry.unregister(parseService(req));
    return res.json(service);
  }
);
router.get(
  "/find/:serviceName/:serviceVersion",
  async (req: Request, res: Response, next: NextFunction) => {
    const { serviceName, serviceVersion } = req.params;
    const service = registry.get(serviceName, serviceVersion);
    if (!service)
      return res.status(404).json({ detail: "No matching service found!" });
    return res.json(service);
  }
);

export default router;
