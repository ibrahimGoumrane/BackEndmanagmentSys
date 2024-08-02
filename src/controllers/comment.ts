import { RequestHandler } from "express";
import {
  commentId,
  commentCreation,
  commentUpdate,
  comment,
} from "../models/comment";
import createHttpError from "http-errors";

export const getComment: RequestHandler<
  commentId,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  try {
    const commentModel = await comment.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });
    if (!commentModel) {
      throw createHttpError(404, "Comment not found");
    }
    const returnedComment = {
      id: commentModel.id,
      content: commentModel.content,
      taskId: commentModel.taskId,
      userId: commentModel.userId,
      userName: commentModel.user.name,
      createdAt: commentModel.createdAt,
      updatedAt: commentModel.updatedAt,
    };

    res.status(200).json(returnedComment);
  } catch (error) {
    next(error);
  }
};
export const getCommentBasedTask: RequestHandler<
  commentId,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const commentModel = await comment.findMany({
      where: {
        taskId: Number(id),
      },include:{
        user:true
      }
    });
    if (!commentModel) {
      throw createHttpError(404, "Comment not found");
    }
    const returnedComment = commentModel.map((comm) => ({
      id: comm.id,
      content: comm.content,
      taskId: comm.taskId,
      userId: comm.userId,
      userName: comm.user.name,
      createdAt: comm.createdAt,
      updatedAt: comm.updatedAt,
    }));

    res.status(200).json(returnedComment);
  } catch (error) {
    next(error);
  }
};

export const createComment: RequestHandler<
  unknown,
  unknown,
  commentCreation,
  unknown
> = async (req, res, next) => {
  const { content, taskId, userId } = req.body;

  try {
    const newComment = await comment.create({
      data: {
        content,
        taskId,
        userId,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};
export const modifComment: RequestHandler<
  commentId,
  unknown,
  commentUpdate,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { content, taskId, userId } = req.body;

  try {
    const updateData: { [key: string]: unknown } = {};
    if (content !== undefined) updateData.content = content;
    if (taskId !== undefined) updateData.taskId = taskId;
    if (userId !== undefined) updateData.userId = userId;
    if (id === "-1") {
      return next();
    }

    const founded = await comment.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!founded) {
      return next();
    }
    const updatedComment = await comment.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
    if (!updatedComment) {
      throw createHttpError(404, "Comment not found");
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};
export const deleteComment: RequestHandler<
  commentId,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;

  try {
    const commentExist = await comment.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!commentExist) {
      throw createHttpError(404, "Comment not found");
    }
    const deletedComment = await comment.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
};
