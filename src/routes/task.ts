import { Router } from "express";
import * as TaskController from "../controllers/task";
import { checkError } from "../middleware/requireAuth";
import { validateTask } from "../util/validators/validateData";

const router = Router();

router.get("/user/assigned", TaskController.getAllUserAssignedTask);
router.get("/user/created", TaskController.getAllUserCreatedTask);
router.get("/project/:projectId", TaskController.getProjectTasks);
router.get("/:id", TaskController.getTask);
router.post("/", validateTask, checkError, TaskController.createTask);
router.put(
  "/",
  validateTask,
  checkError,
  TaskController.updateTask,
  TaskController.createTask
);
router.delete("/user", TaskController.deleteUserTasks);
router.delete("/:id", TaskController.deleteTask);

export default router;
