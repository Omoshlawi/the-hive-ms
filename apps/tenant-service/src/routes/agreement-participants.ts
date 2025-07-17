import { Router } from "express";
import {
  addAgreementParticipant,
  deleteAgreementParticipant,
  getAgreementParticipant,
  getAgreementParticipants,
  patchAgreementParticipant,
  purgeAgreementParticipant,
  updateAgreementParticipant,
} from "../controllers/agrement-participants";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAgreementParticipants);
router.post("/", addAgreementParticipant);
router.get(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  getAgreementParticipant
);
router.patch(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  patchAgreementParticipant
);
router.put(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  updateAgreementParticipant
);
router.delete(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  deleteAgreementParticipant
);
router.purge(
  "/:participantId",
  [validateUUIDPathParam("participantId")],
  purgeAgreementParticipant
);

export default router;
