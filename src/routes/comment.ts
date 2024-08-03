import express from "express";
import * as CommentController from "../controllers/comment";
import { checkError, UserAutorisation } from "../middleware/requireAuth";
import { comment } from "../util/validators/validateData";

const router = express.Router();

router.get("/:id", CommentController.getComment);
router.get("/task/:id", CommentController.getCommentBasedTask);
router.post("/", comment, checkError, CommentController.createComment);
router.put(
  "/:id",
  UserAutorisation,
  CommentController.modifComment,
  CommentController.createComment
);

router.delete("/task/:id", UserAutorisation, CommentController.deleteComment);

export default router;
