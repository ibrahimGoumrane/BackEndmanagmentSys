import { Router } from "express";
import * as TeamController from "../controllers/team";
import { checkAuth, checkError } from "../middleware/requireAuth";
import { team } from "../util/validators/validateData";
const router = Router();

router.get("/", checkError, TeamController.getTeams);
router.get("/:id", TeamController.getTeam);
router.get("/project/:id", TeamController.getProjectTeam);
router.get("/user/:id", TeamController.getUserTeam);
router.get("/members/:id", TeamController.getTeamMembers);
router.post("/createTeam", team, checkError, TeamController.createTeam);
router.post("/:id", checkAuth, TeamController.addUserTeam, TeamController.getTeamMembers);
router.put("/:id", checkAuth, TeamController.updateTeam);
router.delete("/members/:id", checkAuth, TeamController.deleteTeamMember, TeamController.getTeamMembers);
router.delete("/:id", checkAuth, TeamController.deleteTeam);

export default router;
