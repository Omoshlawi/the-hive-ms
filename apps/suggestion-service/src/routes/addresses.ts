import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  patchAddress,
  purgeAddress,
  updateAddress,
} from "../controllers/addresses";
import {
  requireContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", [requireContext], getAddresses);
router.post("/", [requireContext], addAddress);
router.get(
  "/:addressId",
  [validateUUIDPathParam("addressId"), requireContext],
  getAddress
);
router.patch(
  "/:addressId",
  [validateUUIDPathParam("addressId"), requireContext],
  patchAddress
);
router.put(
  "/:addressId",
  [validateUUIDPathParam("addressId"), requireContext],
  updateAddress
);
router.delete(
  "/:addressId",
  [validateUUIDPathParam("addressId")],
  deleteAddress
);
router.purge("/:addressId", [validateUUIDPathParam("addressId")], purgeAddress);

export default router;
