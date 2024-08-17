import { Router } from "express";
import * as StatusController from "../controllers/status";
import { status } from "../util/validators/validateData";
import { checkError } from "../middleware/requireAuth";
import { Action, ModuleType } from "@prisma/client";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";

const router = Router();

router.get("/projects", StatusController.getAllProjectStatus);
router.get("/tasks/:projectId", StatusController.getTaskStatusByProjectID);
router.post(
  "/",
  status,
  checkError,
  checkAuthorization(ModuleType.TASKMANAGER, Action.CREATE),
  StatusController.createTaskStatus
);
router.put(
  "/tasks/:id",
  checkAuthorization(ModuleType.TASKMANAGER, Action.UPDATE),
  StatusController.updateTaskStatus
);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.TASKMANAGER, Action.DELETE),
  StatusController.deleteTaskStatus
);

export default router;
