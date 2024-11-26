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
  "/:relationshipTypeUuid",
  [validateUUIDPathParam("relationshipTypeUuid")],
  getRelationshipType
);
router.patch(
  "/:relationshipTypeUuid",
  [validateUUIDPathParam("relationshipTypeUuid")],
  patchRelationshipType
);
router.put(
  "/:relationshipTypeUuid",
  [validateUUIDPathParam("relationshipTypeUuid")],
  updateRelationshipType
);
router.delete(
  "/:relationshipTypeUuid",
  [validateUUIDPathParam("relationshipTypeUuid")],
  deleteRelationshipType
);
router.purge(
  "/:relationshipTypeUuid",
  [validateUUIDPathParam("relationshipTypeUuid")],
  purgeRelationshipType
);

export default router;
