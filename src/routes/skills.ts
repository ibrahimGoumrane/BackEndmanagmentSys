import { Router } from "express";
import * as SkillsController from "../controllers/skills";

const router = Router();

router.get("/", SkillsController.getSkills);
router.get("/:id", SkillsController.getSkill);

router.post("/", SkillsController.addSkills);

router.delete("/:id", SkillsController.removeSkill);

export default router;
