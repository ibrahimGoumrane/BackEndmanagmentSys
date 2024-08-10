import express from "express";
import * as ChatController from "../controllers/chat";

const router = express.Router();

router.get("/teams/:id" , ChatController.getTeamChat);
router.get("/users/:id" , ChatController.getUserChat);
router.get("/attachment" , ChatController.getAttachments);
router.get("/attachment/:id" , ChatController.getAttachment);
router.post("/teams" , ChatController.saveTeamMessage);
router.post("/users" , ChatController.saveUserMessage);
router.post("/attachment" , ChatController.saveAttachment);


export default router;
