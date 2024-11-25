import { Router } from "express";
import {
  addAttributeType,
  deleteAttributeType,
  getAttributeType,
  getAttributeTypes,
  patchAttributeType,
  purgeAttributeType,
  updateAttributeType,
} from "../controllers/attribute-types";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getAttributeTypes);
router.post("/", addAttributeType);
router.get(
  "/:attributeTypeId",
  [validateUUIDPathParam("attributeTypeId")],
  getAttributeType
);
router.patch(
  "/:attributeTypeId",
  [validateUUIDPathParam("attributeTypeId")],
  patchAttributeType
);
router.put(
  "/:attributeTypeId",
  [validateUUIDPathParam("attributeTypeId")],
  updateAttributeType
);
router.delete(
  "/:attributeTypeId",
  [validateUUIDPathParam("attributeTypeId")],
  deleteAttributeType
);
router.purge(
  "/:attributeTypeId",
  [validateUUIDPathParam("attributeTypeId")],
  purgeAttributeType
);

export default router;
