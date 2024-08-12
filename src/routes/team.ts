import { Router } from "express";
import * as TeamController from "../controllers/team";
import {  checkError } from "../middleware/requireAuth";
import { team } from "../util/validators/validateData";
import checkAuthorization from "../middleware/autorisationMidlwares/isAuthorised";
import { Action, ModuleType } from "@prisma/client";
const router = Router();

router.get("/", TeamController.getTeams);
router.get("/members/:id", TeamController.getTeamByUserId);
router.get("/data/:id", TeamController.getTeamData);
router.get("/:id", TeamController.getTeam);
router.get("/user/:id", TeamController.getUserTeam);
router.get("/members/:id", TeamController.getTeamMembers);
router.get("/requestJoin/response", TeamController.handleReponseRequestJoin);
router.post("/requestJoin", TeamController.requestJoin);
router.post("/createTeam", team, checkError, TeamController.createTeam);


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
