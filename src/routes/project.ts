import { Router } from "express";

import * as ProjectController from "../controllers/project";
import { validateCreateProject } from "../util/validators/validateData";
import { checkError } from "../middleware/requireAuth";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import { Action, ModuleType } from "@prisma/client";

const router = Router();

router.get("/", ProjectController.getProjects);

router.get("/user/", ProjectController.getUserProjects);
router.get("/user/:id", ProjectController.getProjectMembers);
router.get("/status/:id", ProjectController.getProjectStatus);
router.get("/task/:id", ProjectController.getProjectTasks);
router.get("/comment/:id", ProjectController.getProjectActivity);
router.get("/:id", ProjectController.getProject);
router.post(
  "/",
  validateCreateProject,
  checkError,
  ProjectController.createProject
);
router.put("/user/:id", checkAuthorization(ModuleType.PROJECT, Action.UPDATE), ProjectController.updateProjectMembers);
router.put(
  "/:id",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  ProjectController.updateProject,
  ProjectController.createProject
);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  ProjectController.deleteProject
);

export default router;
