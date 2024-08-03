import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { comment, commentId } from "../models/comment";

const requiresAuth: RequestHandler<unknown, unknown, unknown, unknown> = (
  req,
  res,
  next
) => {
  if (req.session.userId) {
    next();
  } else {
    next(createHttpError(401, "User not authenticated"));
  }
};
export default requiresAuth;

export const checkError: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  console.error(errors);
  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .filter((error) => error.msg !== "Invalid value")
      .map((error) => error.msg)
      .join(" , ");
    return next(createHttpError(400, errorMessage));
  }
  next();
};
export const UserAutorisation: RequestHandler<
  commentId,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.session;

  try {
    if (id == "-1" || !id) {
      return next();
    }

    const commentModel = await comment.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });
    console.log(commentModel);
    if (!commentModel) return next();
    const commentOwner = commentModel?.userId;

    if (userId == commentOwner) {
      return next();
    } else {
      return next(
        createHttpError(401, "User not authoriwed to perform this action")
      );
    }
  } catch (error) {
    next(error);
  }
};
