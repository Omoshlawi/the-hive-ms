import serviceClient from "@/services/service-client";
import {
  requireAuthentication,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import { Router } from "express";
import {
  addListing,
  deleteListing,
  getListing,
  getListings,
  patchListing,
  purgeListing,
  updateListing,
} from "../controllers/listings";

const router = Router({ mergeParams: true });

router.get("/", getListings);
router.post("/", [requireAuthentication(serviceClient)], addListing);
router.get("/:listingId", [validateUUIDPathParam("listingId")], getListing);
router.patch("/:listingId", [validateUUIDPathParam("listingId")], patchListing);
router.put("/:listingId", [validateUUIDPathParam("listingId")], updateListing);
router.delete(
  "/:listingId",
  [validateUUIDPathParam("listingId")],
  deleteListing
);
router.purge("/:listingId", [validateUUIDPathParam("listingId")], purgeListing);

export default router;
