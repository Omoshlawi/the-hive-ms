import { Router } from "express";
import {
  addPerson,
  deletePerson,
  getPerson,
  getPersons,
  linkUserToPerson,
  patchPerson,
  purgePerson,
  updatePerson,
} from "../controllers/person";
import { validateUUIDPathParam } from "@hive/shared-middlewares";

const router = Router({ mergeParams: true });

router.get("/", getPersons);
router.post("/", addPerson);
router.get("/:personId", [validateUUIDPathParam("personId")], getPerson);
router.patch("/:personId", [validateUUIDPathParam("personId")], patchPerson);
router.post("/:personId", [validateUUIDPathParam("personId")], linkUserToPerson);
router.put("/:personId", [validateUUIDPathParam("personId")], updatePerson);
router.delete("/:personId", [validateUUIDPathParam("personId")], deletePerson);
router.purge("/:personId", [validateUUIDPathParam("personId")], purgePerson);

export default router;
