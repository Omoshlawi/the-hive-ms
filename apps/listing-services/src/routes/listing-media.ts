import { Router } from "express";
import {
  addListingMedia,
  deleteListingMedia,
  getListingMedia,
  getListingMedias,
  patchListingMedia,
  purgeListingMedia,
  updateListingMedia,
} from "../controllers/listing-media";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get("/", getListingMedias);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  addListingMedia
);
router.get("/:mediaId", [validateUUIDPathParam("mediaId")], getListingMedia);
router.patch(
  "/:mediaId",
  [
    validateUUIDPathParam("mediaId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  patchListingMedia
);
router.put(
  "/:mediaId",
  [
    validateUUIDPathParam("mediaId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  updateListingMedia
);
router.delete(
  "/:mediaId",
  [
    validateUUIDPathParam("mediaId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  deleteListingMedia
);
router.purge(
  "/:mediaId",
  [
    validateUUIDPathParam("mediaId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  purgeListingMedia
);

export default router;
