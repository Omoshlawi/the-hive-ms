import { Router } from "express";
import {
  addRelationshipType,
  deleteRelationshipType,
  getRelationshipType,
  getRelationshipTypes,
  patchRelationshipType,
  purgeRelationshipType,
  updateRelationshipType,
} from "../controllers/relationship-type";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getRelationshipTypes);
router.post("/", addRelationshipType);
router.get(
  "/:relationshipTypeId",
  [validateUUIDPathParam("relationshipTypeId")],
  getRelationshipType
);
router.patch(
  "/:relationshipTypeId",
  [validateUUIDPathParam("relationshipTypeId")],
  patchRelationshipType
);
router.put(
  "/:relationshipTypeId",
  [validateUUIDPathParam("relationshipTypeId")],
  updateRelationshipType
);
router.delete(
  "/:relationshipTypeId",
  [validateUUIDPathParam("relationshipTypeId")],
  deleteRelationshipType
);
router.purge(
  "/:relationshipTypeId",
  [validateUUIDPathParam("relationshipTypeId")],
  purgeRelationshipType
);

export default router;
