import { Router } from "express";
import {
  addSalesListingFinancialOption,
  deleteSalesListingFinancialOption,
  getSalesListingFinancialOption,
  getSalesListingFinancialOptions,
  patchSalesListingFinancialOption,
  purgeSalesListingFinancialOption,
  updateSalesListingFinancialOption,
} from "../controllers/listing-financial-options";
import {
  requireAuthentication,
  requireContext,
  requireOrganizationContext,
  validateUUIDPathParam,
} from "@hive/shared-middlewares";
import serviceClient from "@/services/service-client";

const router = Router({ mergeParams: true });

router.get("/", getSalesListingFinancialOptions);
router.post(
  "/",
  [
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  addSalesListingFinancialOption
);
router.get(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  getSalesListingFinancialOption
);
router.patch(
  "/:optionId",
  [
    validateUUIDPathParam("optionId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  patchSalesListingFinancialOption
);
router.put(
  "/:optionId",
  [
    validateUUIDPathParam("optionId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  updateSalesListingFinancialOption
);
router.delete(
  "/:optionId",
  [
    validateUUIDPathParam("optionId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  deleteSalesListingFinancialOption
);
router.purge(
  "/:optionId",
  [
    validateUUIDPathParam("optionId"),
    requireAuthentication(serviceClient),
    requireContext,
    requireOrganizationContext(serviceClient),
  ],
  purgeSalesListingFinancialOption
);

export default router;
