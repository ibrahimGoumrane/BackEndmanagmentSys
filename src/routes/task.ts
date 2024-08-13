import { Router } from "express";
import * as TaskController from "../controllers/task";
import { checkError } from "../middleware/requireAuth";
import { validateTask } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import { Action, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  extendAuth,
  updateAuth,
} from "../middleware/autorisationMidlwares/extendAuth";

const router = Router();
//no authorisation needed to perform these actions
router.get("/user/assigned", TaskController.getAllUserAssignedTask);
router.get("/user/created", TaskController.getAllUserCreatedTask);
router.get("/project/:projectId", TaskController.getProjectTasks);
router.get("/:id", TaskController.getTask);
router.delete("/user", TaskController.deleteUserTasks);

//here we give permission dynamically
router.post(
  "/auth/task",
  checkAuthorization(ModuleType.TASKMANAGER, Action.CREATE),
  extendAuth(ModuleType.TASK, Action.CREATE)
);
router.put(
  "/auth/task",
  checkAuthorization(ModuleType.TASKMANAGER, Action.UPDATE),
  updateAuth(ModuleType.TASK, Action.UPDATE)
);
router.delete(
  "/auth",
  checkAuthorization(ModuleType.TASKMANAGER, Action.DELETE),
  deleteAuth()
);
//here we gonna check user authorisation.
router.post(
  "/",
  validateTask,
  checkError,
  checkAuthorization(ModuleType.TASK, Action.CREATE),
  TaskController.createTask
);
router.put(
  "/",
  validateTask,
  checkError,
  checkAuthorization(ModuleType.TASK, Action.UPDATE),
  TaskController.updateTask,
  TaskController.createTask
);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.TASK, Action.DELETE),
  TaskController.deleteTask
);

export default router;
