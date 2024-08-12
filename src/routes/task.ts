import { Router } from "express";
import * as TaskController from "../controllers/task";
import { checkError } from "../middleware/requireAuth";
import { validateTask } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import { Action, ModuleType } from "@prisma/client";

const router = Router();

router.get("/user/assigned", TaskController.getAllUserAssignedTask);
router.get("/user/created", TaskController.getAllUserCreatedTask);
router.get("/project/:projectId", TaskController.getProjectTasks);
router.get("/:id", TaskController.getTask);
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
router.delete("/user", TaskController.deleteUserTasks);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.TASK, Action.DELETE),
  TaskController.deleteTask
);

export default router;
