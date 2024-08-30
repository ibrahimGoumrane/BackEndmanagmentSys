import { Router } from "express";
import * as TeamController from "../controllers/team";
import requiresAuth, { checkError } from "../middleware/requireAuth";
import { team } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import giveAuth from "../middleware/autorisationMidlwares/giveAuth";
import { Action, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  updateAuth,
} from "../middleware/autorisationMidlwares/extendAuth";
const router = Router();
const AuthRequiredRouter = Router();

//no auth needed to perform this actions
router.get("/requestJoin/response", TeamController.handleReponseRequestJoin);

//evryone can do them
AuthRequiredRouter.get("/", TeamController.getTeams);
AuthRequiredRouter.get("/data/:id", TeamController.getTeamData);
AuthRequiredRouter.get("/:id", TeamController.getTeam);
AuthRequiredRouter.get("/user/:id", TeamController.getUserTeam);
AuthRequiredRouter.get("/members/:id", TeamController.getTeamMembers);
AuthRequiredRouter.get("/img/:id", TeamController.getTeamImage);
AuthRequiredRouter.post("/requestJoin", TeamController.requestJoin);

//everyone can do them but here only the user how created that team should have accss to its delete and update
AuthRequiredRouter.post(
  "/createTeam",
  team,
  checkError,
  TeamController.createTeam,
  giveAuth(ModuleType.TEAM, Action.UPDATE),
  giveAuth(ModuleType.TEAM, Action.DELETE),
  TeamController.getTeam
);

//give auth dynamique
AuthRequiredRouter.put(
  "/auth",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  updateAuth(ModuleType.TEAM, Action.UPDATE)
);

AuthRequiredRouter.delete(
  "/auth",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  deleteAuth()
);

//auth needed
AuthRequiredRouter.post(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  TeamController.addUserTeam,
  TeamController.getTeamMembers
);
AuthRequiredRouter.put(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  TeamController.updateTeam
);
AuthRequiredRouter.delete(
  "/members/:id",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  TeamController.deleteTeamMember,
  TeamController.getTeamMembers
);
AuthRequiredRouter.delete("/leave/:id", TeamController.leaveTeam);

AuthRequiredRouter.delete(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  TeamController.deleteTeam
);
router.use("/", requiresAuth, AuthRequiredRouter);
export default router;
