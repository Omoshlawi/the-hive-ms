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
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAddresses);
router.post("/", addAddress);
router.get("/:addressId", [validateUUIDPathParam("addressId")], getAddress);
router.patch("/:addressId", [validateUUIDPathParam("addressId")], patchAddress);
router.put("/:addressId", [validateUUIDPathParam("addressId")], updateAddress);
router.delete(
  "/:addressId",
  [validateUUIDPathParam("addressId")],
  deleteAddress
);
router.purge("/:addressId", [validateUUIDPathParam("addressId")], purgeAddress);

export default router;
