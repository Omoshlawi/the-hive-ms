import serviceClient from "@/services/service-client";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
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
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient, true),
  ],
  addListing
);
router.get("/:listingId", [validateUUIDPathParam("listingId")], getListing);
router.patch(
  "/:listingId",
  [
    validateUUIDPathParam("listingId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  patchListing
);
router.put(
  "/:listingId",
  [
    validateUUIDPathParam("listingId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  updateListing
);
router.delete(
  "/:listingId",
  [
    validateUUIDPathParam("listingId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  deleteListing
);
router.purge(
  "/:listingId",
  [
    validateUUIDPathParam("listingId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  purgeListing
);

export default router;
