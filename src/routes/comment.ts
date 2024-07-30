import express from "express";
import * as CommentController from "../controllers/comment";
import { checkError, UserAutorisation } from "../middleware/requireAuth";
import { comment } from "../util/validators/validateData";

const router = express.Router();

router.get("/:id", CommentController.getComment);
router.get("/task/:id" , CommentController.getCommentBasedTask)
router.post("/", comment, checkError, CommentController.createComment);

router.use(UserAutorisation);
router.put("/:id", UserAutorisation, CommentController.modifComment);

router.delete("/:id", UserAutorisation, CommentController.deleteComment);

export default router;
