import { Router } from "express";
import * as StatusController from "../controllers/status";
import { status } from "../util/validators/validateData";
import { checkError } from "../middleware/requireAuth";

const router = Router();

router.get("/projects", StatusController.getAllProjectStatus);
router.put("/tasks/:id", StatusController.updateTaskStatus);

router.get("/tasks/:projectId", StatusController.getTaskStatusByProjectID);

router.post("/", status, checkError, StatusController.createTaskStatus);

router.delete("/:id", StatusController.deleteTaskStatus);

export default router;
