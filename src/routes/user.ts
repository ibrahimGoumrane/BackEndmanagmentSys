import { Router } from "express";
import * as UserController from "../controllers/users";
import requiresAuth, { checkError } from "../middleware/requireAuth";
import {
  validateLogin,
  validateSignUp,
} from "../util/validators/validateUserData";
const router = Router();
router.get("/", requiresAuth, UserController.getLoggedInUser);
router.get("/:id", requiresAuth, UserController.getUserData);
router.get("/profile/:id", requiresAuth, UserController.getProfileImage);
router.post("/signUp", validateSignUp, checkError, UserController.signUp);
router.post("/logIn", validateLogin, checkError, UserController.logIn);
router.post("/logout", UserController.logout);
router.put("/", requiresAuth, UserController.updateUser);
router.put("/skills/", UserController.updateUserSkills);
router.put("/teams/", UserController.updateUserTeams);
router.delete("/:id", UserController.deleteUser);

export default router;
