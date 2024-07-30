import { RequestHandler } from "express";
import { ActivityId, ActivityCreation, activity } from "../models/activity";
import createHttpError from "http-errors";

export const getActivity: RequestHandler<
  ActivityId,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const returnedActivity = await activity.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!returnedActivity) {
      throw createHttpError(404, "Activity not found");
    }
    res.status(200).json(returnedActivity);
  } catch (error) {
    next(error);
  }
};
export const addActivity: RequestHandler<
  unknown,
  unknown,
  ActivityCreation,
  unknown
> = async (req, res, next) => {
  const { description, taskId } = req.body;
  try {
    const { userId } = req.session;
    if (!userId) {
      throw createHttpError(401, "Unauthorized");
    }
    const newActivity = await activity.create({
      data: {
        description: description,
        taskId,
        userId,
      },
    });
    if (!newActivity) {
      throw createHttpError(500, "Activity not created try again");
    }

    res.status(201).json(newActivity);
  } catch (error) {
    next(error);
  }
};
