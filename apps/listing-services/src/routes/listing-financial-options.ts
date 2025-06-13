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
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getSalesListingFinancialOptions);
router.post("/", addSalesListingFinancialOption);
router.get(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  getSalesListingFinancialOption
);
router.patch(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  patchSalesListingFinancialOption
);
router.put(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  updateSalesListingFinancialOption
);
router.delete(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  deleteSalesListingFinancialOption
);
router.purge(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  purgeSalesListingFinancialOption
);

export default router;
