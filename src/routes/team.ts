import { Router } from "express";
import * as TeamController from "../controllers/team";
import { checkError } from "../middleware/requireAuth";
import { team } from "../util/validators/validateData";
const router = Router();

router.get("/", team, checkError, TeamController.getTeams);
router.get("/project/:id", TeamController.getProjectTeam);
router.get("/user/:id", TeamController.getUserTeam);
router.post("/createTeam", team, checkError, TeamController.createTeam);
router.post("/:id", TeamController.addUserTeam);
router.put("/:id", TeamController.updateTeam);
router.delete("/:id", TeamController.deleteTeam);

export default router;
