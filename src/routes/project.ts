import { Router } from "express";
import * as ProjectController from "../controllers/project";
import { validateCreateProject } from "../util/validators/validateData";
import requiresAuth, { checkError } from "../middleware/requireAuth";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import giveAuth from "../middleware/autorisationMidlwares/giveAuth";
import { Action, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  extendAuth,
} from "../middleware/autorisationMidlwares/extendAuth";
import { getActivitiesByType } from "../middleware/activityMiddleware/getActivity";

const router = Router();
const AuthRequiredRouter = Router();
//no auth needed to perform this actions

//no need for auth
router.get("/requestJoin/response", ProjectController.handleReponseRequestJoin);

//auth needed
AuthRequiredRouter.get("/", ProjectController.getProjects);
AuthRequiredRouter.get("/requestJoin/:id", ProjectController.requestToJoin);
AuthRequiredRouter.get("/user/", ProjectController.getUserProjects);
AuthRequiredRouter.get("/user/:id", ProjectController.getProjectMembers);
AuthRequiredRouter.get("/status/:id", ProjectController.getProjectStatus);
AuthRequiredRouter.get("/task/:id", ProjectController.getProjectTasks);
AuthRequiredRouter.get("/auth", ProjectController.getProjectAuth);
AuthRequiredRouter.get("/info/:id", ProjectController.getProjectInfo);
AuthRequiredRouter.get("/img/:id", ProjectController.getProjectImage);
//related to projectActivity
AuthRequiredRouter.get(
  "/activity/:projectId/:activityType",
  getActivitiesByType
);

AuthRequiredRouter.get("/:id", ProjectController.ProjectData);
//here we give the auth to the creator
AuthRequiredRouter.post(
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
AuthRequiredRouter.post(
  "/auth/taskManager/create",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.CREATE)
);
AuthRequiredRouter.post(
  "/auth/taskManager/update",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.UPDATE)
);
AuthRequiredRouter.post(
  "/auth/taskManager/delete",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  extendAuth(ModuleType.TASKMANAGER, Action.DELETE)
);
//delete a permission
AuthRequiredRouter.delete(
  "/auth",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  deleteAuth()
);

//checkAuth
AuthRequiredRouter.put(
  "/user",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  ProjectController.updateProjectMembers
);
AuthRequiredRouter.put(
  "/projectImage/:id",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  ProjectController.updateProjectImage
);
AuthRequiredRouter.put(
  "/:id",
  checkAuthorization(ModuleType.PROJECT, Action.UPDATE),
  ProjectController.updateProject,
  ProjectController.createProject
);

AuthRequiredRouter.delete(
  "/removeMember/:id",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  ProjectController.removeMember
);
AuthRequiredRouter.delete("/leaveProject/:id", ProjectController.leaveProject);
AuthRequiredRouter.delete(
  "/:id",
  checkAuthorization(ModuleType.PROJECT, Action.DELETE),
  ProjectController.deleteProject
);

router.use("/", requiresAuth, AuthRequiredRouter);
export default router;
