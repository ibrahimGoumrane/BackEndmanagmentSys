import { Router } from "express";

import * as ProjectController from "../controllers/project";
import { validateCreateProject } from "../util/validators/validateData";
import { checkError } from "../middleware/requireAuth";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import giveAuth from "../middleware/autorisationMidlwares/giveAuth";
import { Action, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  extendAuth,
  updateAuth,
} from "../middleware/autorisationMidlwares/extendAuth";

const router = Router();

//no auth needed to perform this actions
router.get("/", ProjectController.getProjects);
router.get("/user/", ProjectController.getUserProjects);
router.get("/user/:id", ProjectController.getProjectMembers);
router.get("/status/:id", ProjectController.getProjectStatus);
router.get("/task/:id", ProjectController.getProjectTasks);
router.get("/comment/:id", ProjectController.getProjectActivity);
router.get("/:id", ProjectController.getProject);

//here we give the auth to the creator
router.post(
  "/",
  validateCreateProject,
  checkError,
  giveAuth(ModuleType.PROJECT, Action.UPDATE),
  giveAuth(ModuleType.PROJECT, Action.DELETE),
  giveAuth(ModuleType.TASKMANAGER, Action.CREATE),
  giveAuth(ModuleType.TASKMANAGER, Action.UPDATE),
  giveAuth(ModuleType.TASKMANAGER, Action.DELETE),
  ProjectController.createProject
);
//////////////here we permit the auth to be dynamique
//Project Authorisation
router.post(
  "/auth/project",
  checkAuthorization(ModuleType.PROJECT, Action.CREATE),
  extendAuth(ModuleType.PROJECT, Action.CREATE)
);
router.put(
  "/auth/project",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  updateAuth(ModuleType.PROJECT, Action.UPDATE)
);
//taskManager Authorisation
router.post(
  "/auth/taskManager",
  checkAuthorization(ModuleType.PROJECT, Action.CREATE),
  extendAuth(ModuleType.TASKMANAGER, Action.CREATE)
);
router.put(
  "/auth/taskManager",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  updateAuth(ModuleType.TASKMANAGER, Action.UPDATE)
);
//delete a permission
router.delete(
  "/auth",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  deleteAuth()
);

//checkAuth
router.put(
  "/user/:id",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  ProjectController.updateProjectMembers
);
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
