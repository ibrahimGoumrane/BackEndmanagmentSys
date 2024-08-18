import { Router } from "express";
import * as TaskController from "../controllers/task";
import { checkError } from "../middleware/requireAuth";
import { validateTask } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import { Action, TASKACTIVITYTYPE, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  extendAuth,
  updateAuth,
} from "../middleware/autorisationMidlwares/extendAuth";
import { createDeleteActivity } from "../middleware/activityMiddleware/createActivity";

const router = Router();
//no authorisation needed to perform these actions
router.get("/user/assigned", TaskController.getAllUserAssignedTask);
router.get("/user/created", TaskController.getAllUserCreatedTask);
router.get("/project/:projectId", TaskController.getProjectTasks);
router.get("/:id", TaskController.getTask);

//here we give permission dynamically
router.post(
  "/auth",
  checkAuthorization(ModuleType.TASKMANAGER, Action.CREATE),
  extendAuth(ModuleType.TASKMANAGER, Action.CREATE)
);
router.put(
  "/auth",
  checkAuthorization(ModuleType.TASKMANAGER, Action.UPDATE),
  updateAuth(ModuleType.TASKMANAGER, Action.UPDATE)
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
  checkAuthorization(ModuleType.TASKMANAGER, Action.CREATE),
  TaskController.createTask,
  createDeleteActivity(TASKACTIVITYTYPE.CREATE)
);
router.put(
  "/",
  validateTask,
  checkError,
  checkAuthorization(ModuleType.TASKMANAGER, Action.UPDATE),
  TaskController.updateTask,
  TaskController.createTask
);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.TASKMANAGER, Action.DELETE),
  TaskController.deleteTask,
  createDeleteActivity(TASKACTIVITYTYPE.DELETE)
);
export default router;
