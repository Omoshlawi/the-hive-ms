import { Router } from "express";
import {
  addCoApplicant,
  deleteCoApplicant,
  getCoApplicant,
  getCoApplicants,
  patchCoApplicant,
  purgeCoApplicant,
  updateCoApplicant,
} from "../controllers/application-coapplicants";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getCoApplicants);
router.post("/", addCoApplicant);
router.get(
  "/:coApplicantId",
  [validateUUIDPathParam("coApplicantId")],
  getCoApplicant
);
router.patch(
  "/:coApplicantId",
  [validateUUIDPathParam("coApplicantId")],
  patchCoApplicant
);
router.put(
  "/:coApplicantId",
  [validateUUIDPathParam("coApplicantId")],
  updateCoApplicant
);
router.delete(
  "/:coApplicantId",
  [validateUUIDPathParam("coApplicantId")],
  deleteCoApplicant
);
router.purge(
  "/:coApplicantId",
  [validateUUIDPathParam("coApplicantId")],
  purgeCoApplicant
);

export default router;
