import serviceClient from "@/services/service-client";
import {
  optionalContext,
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
import listingAdditionalChargesRouter from "./listing-additional-charges";
import listingFinancingRouter from "./listing-financial-options";
import listingStatusRouter from "./listing-status";
import listingMediaRouter from "./listing-media";
const router = Router({ mergeParams: true });

router.get("/", [optionalContext], getListings);
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
router.use(
  "/:listingId/financing-options",
  [validateUUIDPathParam("listingId")],
  listingFinancingRouter
);
router.use(
  "/:listingId/additional-charges",
  [validateUUIDPathParam("listingId")],
  listingAdditionalChargesRouter
);
router.use(
  "/:listingId/media",
  [validateUUIDPathParam("listingId")],
  listingMediaRouter
);
router.use(
  "/:listingId/status",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  listingStatusRouter
);

export default router;
