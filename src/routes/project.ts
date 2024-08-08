import { Router } from "express";

import * as ProjectController from "../controllers/project";
import { validateCreateProject } from "../util/validators/validateData";
import { checkError } from "../middleware/requireAuth";

const router = Router();

router.get("/", ProjectController.getProjects);
router.post(
  "/",
  validateCreateProject,
  checkError,
  ProjectController.createProject
);
router.get("/user/", ProjectController.getUserProjects);
router.get("/user/:id", ProjectController.getProjectMembers);
router.get("/status/:id", ProjectController.getProjectStatus);
router.get("/task/:id", ProjectController.getProjectTasks);
router.get("/comment/:id", ProjectController.getProjectActivity);
router.get("/:id", ProjectController.getProject);
router.put("/user/:id", ProjectController.updateProjectMembers);
router.put(
  "/:id",
  ProjectController.updateProject,
  ProjectController.createProject
);
router.delete("/:id", ProjectController.deleteProject);

export default router;
