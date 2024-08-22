import { Router } from "express";
import * as TeamController from "../controllers/team";
import { checkError } from "../middleware/requireAuth";
import { team } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import giveAuth from "../middleware/autorisationMidlwares/giveAuth";
import { Action, ModuleType } from "@prisma/client";
import {
  deleteAuth,
  updateAuth,
} from "../middleware/autorisationMidlwares/extendAuth";
const router = Router();

//evryone can do them
router.get("/", TeamController.getTeams);
router.get("/data/:id", TeamController.getTeamData);
router.get("/:id", TeamController.getTeam);
router.get("/user/:id", TeamController.getUserTeam);
router.get("/members/:id", TeamController.getTeamMembers);
router.get("/requestJoin/response", TeamController.handleReponseRequestJoin);
router.get("/img/:id", TeamController.getTeamImage);
router.post("/requestJoin", TeamController.requestJoin);

//everyone can do them but here only the user how created that team should have accss to its delete and update
router.post(
  "/createTeam",
  team,
  checkError,
  TeamController.createTeam,
  giveAuth(ModuleType.TEAM, Action.UPDATE),
  giveAuth(ModuleType.TEAM, Action.DELETE),
  TeamController.getTeam
);

//give auth dynamique
router.put(
  "/auth",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  updateAuth(ModuleType.TEAM, Action.UPDATE)
);

router.delete(
  "/auth",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  deleteAuth()
);

//auth needed
router.post(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  TeamController.addUserTeam,
  TeamController.getTeamMembers
);
router.put(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.UPDATE),
  TeamController.updateTeam
);
router.delete(
  "/members/:id",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  TeamController.deleteTeamMember,
  TeamController.getTeamMembers
);
router.delete(
  "/:id",
  checkAuthorization(ModuleType.TEAM, Action.DELETE),
  TeamController.deleteTeam
);

export default router;
