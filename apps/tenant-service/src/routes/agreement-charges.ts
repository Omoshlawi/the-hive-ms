import { Router } from "express";
import {
  addAdditionalCharge,
  deleteAdditionalCharge,
  getAdditionalCharge,
  getAdditionalCharges,
  patchAdditionalCharge,
  purgeAdditionalCharge,
  updateAdditionalCharge,
} from "../controllers/agreement-charges";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAdditionalCharges);
router.post("/", addAdditionalCharge);
router.get(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  getAdditionalCharge
);
router.patch(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  patchAdditionalCharge
);
router.put(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  updateAdditionalCharge
);
router.delete(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  deleteAdditionalCharge
);
router.purge(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  purgeAdditionalCharge
);

export default router;
