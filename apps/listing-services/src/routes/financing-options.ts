import { Router } from "express";
import {
  addFinancingOption,
  deleteFinancingOption,
  getFinancingOption,
  getFinancingOptions,
  patchFinancingOption,
  purgeFinancingOption,
  updateFinancingOption,
} from "../controllers/financing-options";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getFinancingOptions);
router.post("/", addFinancingOption);
router.get(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  getFinancingOption
);
router.patch(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  patchFinancingOption
);
router.put(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  updateFinancingOption
);
router.delete(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  deleteFinancingOption
);
router.purge(
  "/:optionId",
  [validateUUIDPathParam("optionId")],
  purgeFinancingOption
);

export default router;
