import { Router } from "express";
import {
  addListingAdditionalCharge,
  deleteListingAdditionalCharge,
  getListingAdditionalCharge,
  getListingAdditionalCharges,
  patchListingAdditionalCharge,
  purgeListingAdditionalCharge,
  updateListingAdditionalCharge,
} from "../controllers/listing-additional-charges";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getListingAdditionalCharges);
router.post("/", addListingAdditionalCharge);
router.get(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  getListingAdditionalCharge
);
router.patch(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  patchListingAdditionalCharge
);
router.put(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  updateListingAdditionalCharge
);
router.delete(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  deleteListingAdditionalCharge
);
router.purge(
  "/:chargeId",
  [validateUUIDPathParam("chargeId")],
  purgeListingAdditionalCharge
);

export default router;
