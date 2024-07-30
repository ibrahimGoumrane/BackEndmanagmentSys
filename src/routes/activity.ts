import { Router } from "express";

import * as ActivityController from "../controllers/activity";
import { checkError } from "../middleware/requireAuth";
import { permission } from "../util/validators/validateData";

const router = Router();

router.get("/:id", ActivityController.getActivity);
router.post("/", permission, checkError, ActivityController.addActivity);

export default router;
