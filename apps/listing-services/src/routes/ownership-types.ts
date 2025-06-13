import { Router } from "express";
import {
  addOwnershipType,
  deleteOwnershipType,
  getOwnershipType,
  getOwnershipTypes,
  patchOwnershipType,
  purgeOwnershipType,
  updateOwnershipType,
} from "../controllers/ownership-types";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getOwnershipTypes);
router.post("/", addOwnershipType);
router.get(
  "/:ownershipTypeId",
  [validateUUIDPathParam("ownershipTypeId")],
  getOwnershipType
);
router.patch(
  "/:ownershipTypeId",
  [validateUUIDPathParam("ownershipTypeId")],
  patchOwnershipType
);
router.put(
  "/:ownershipTypeId",
  [validateUUIDPathParam("ownershipTypeId")],
  updateOwnershipType
);
router.delete(
  "/:ownershipTypeId",
  [validateUUIDPathParam("ownershipTypeId")],
  deleteOwnershipType
);
router.purge(
  "/:ownershipTypeId",
  [validateUUIDPathParam("ownershipTypeId")],
  purgeOwnershipType
);

export default router;
