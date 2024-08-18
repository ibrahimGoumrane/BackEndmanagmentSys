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
} from "../middleware/autorisationMidlwares/extendAuth";

const router = Router();

//no auth needed to perform this actions
router.get("/", ProjectController.getProjects);
router.get("/requestJoin/response", ProjectController.handleReponseRequestJoin);
router.get("/requestJoin/:id", ProjectController.requestToJoin);
router.get("/user/", ProjectController.getUserProjects);
router.get("/user/:id", ProjectController.getProjectMembers);
router.get("/status/:id", ProjectController.getProjectStatus);
router.get("/task/:id", ProjectController.getProjectTasks);
router.get("/auth", ProjectController.getProjectAuth);
router.get("/info/:id", ProjectController.getProjectInfo);
router.get("/img/:id", ProjectController.getProjectImage);

router.get("/:id", ProjectController.ProjectData);
//here we give the auth to the creator
router.post(
  "/",
  validateCreateProject,
  checkError,
  ProjectController.createProject,
  giveAuth(ModuleType.PROJECT, Action.UPDATE),
  giveAuth(ModuleType.PROJECT, Action.DELETE),
  giveAuth(ModuleType.TASKMANAGER, Action.CREATE),
  giveAuth(ModuleType.TASKMANAGER, Action.UPDATE),
  giveAuth(ModuleType.TASKMANAGER, Action.DELETE),
  ProjectController.getProject
);
//taskManager Authorisation
router.post(
  "/auth/taskManager/create",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.CREATE)
);
router.post(
  "/auth/taskManager/update",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.UPDATE)
);
router.post(
  "/auth/taskManager/delete",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.DELETE)
);
//delete a permission
router.delete(
  "/auth",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  deleteAuth()
);

//checkAuth
router.put(
  "/user",
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
