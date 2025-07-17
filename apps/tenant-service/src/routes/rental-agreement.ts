import { Router } from "express";
import {
  addRentalAgreement,
  deleteRentalAgreement,
  getRentalAgreement,
  getRentalAgreements,
  patchRentalAgreement,
  purgeRentalAgreement,
  updateRentalAgreement,
} from "../controllers/rental-agreement";
import { validateUUIDPathParam } from "@hive/shared-middlewares";
import additionsChargesRouter from "./agreement-charges";
import participantsRouter from "./agreement-participants";
const router = Router({ mergeParams: true });

router.get("/", getRentalAgreements);
router.post("/", addRentalAgreement);
router.get(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  getRentalAgreement
);
router.patch(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  patchRentalAgreement
);
router.put(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  updateRentalAgreement
);
router.delete(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  deleteRentalAgreement
);
router.purge(
  "/:agreementId",
  [validateUUIDPathParam("agreementId")],
  purgeRentalAgreement
);
router.use(
  "/:agreementId/additional-charges",
  [validateUUIDPathParam("agreementId")],
  additionsChargesRouter
);
router.use(
  "/:agreementId/participants",
  [validateUUIDPathParam("agreementId")],
  participantsRouter
);

export default router;
