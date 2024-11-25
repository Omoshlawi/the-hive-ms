import { Router } from "express";
import {
  addAmenity,
  deleteAmenity,
  getAmenity,
  getAmenities,
  patchAmenity,
  purgeAmenity,
  updateAmenity,
} from "../controllers/amenities";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAmenities);
router.post("/", addAmenity);
router.get("/:amenityId", [validateUUIDPathParam("amenityId")], getAmenity);
router.patch("/:amenityId", [validateUUIDPathParam("amenityId")], patchAmenity);
router.put("/:amenityId", [validateUUIDPathParam("amenityId")], updateAmenity);
router.delete(
  "/:amenityId",
  [validateUUIDPathParam("amenityId")],
  deleteAmenity
);
router.purge("/:amenityId", [validateUUIDPathParam("amenityId")], purgeAmenity);

export default router;
