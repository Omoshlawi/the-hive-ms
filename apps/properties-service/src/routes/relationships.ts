import { Router } from "express";
import {
  addRelationship,
  deleteRelationship,
  getRelationship,
  getRelationships,
  patchRelationship,
  purgeRelationship,
  updateRelationship,
} from "../controllers/relationships";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getRelationships);
router.post("/", addRelationship);
router.get(
  "/:relationshipId",
  [validateUUIDPathParam("relationshipId")],
  getRelationship
);
router.patch(
  "/:relationshipId",
  [validateUUIDPathParam("relationshipId")],
  patchRelationship
);
router.put(
  "/:relationshipId",
  [validateUUIDPathParam("relationshipId")],
  updateRelationship
);
router.delete(
  "/:relationshipId",
  [validateUUIDPathParam("relationshipId")],
  deleteRelationship
);
router.purge(
  "/:relationshipId",
  [validateUUIDPathParam("relationshipId")],
  purgeRelationship
);

export default router;
