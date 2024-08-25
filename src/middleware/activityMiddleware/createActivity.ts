import { NextFunction, RequestHandler } from "express";
import {
  TaskActivity,
  MembershipActivity,
  TActivity,
} from "../../models/activity";
import { TASKACTIVITYTYPE, MEMBERSHIPACTIVITYTYPE } from "@prisma/client";
import createHttpError from "http-errors";

export const createDeleteActivity = (
  activityType: TASKACTIVITYTYPE
): RequestHandler<unknown, unknown, TActivity, unknown> => {
  return async (req, res, next) => {
    const { userId } = req.session;
    const { Task } = res.locals;
    const { projectId, id, name } = Task;
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }
    if (!projectId) {
      return next(createHttpError(400, "Project ID is required"));
    }
    if (!id) {
      return next(createHttpError(400, "Task Id is required"));
    }
    const commonData = {
      userId,
      createdAt: new Date(),
      activityType,
      projectId: +projectId,
      newValue: name,
      taskId: activityType === TASKACTIVITYTYPE.CREATE ? +id : undefined,
    };

    try {
      // Combine common data with specific data based on activity type
      await TaskActivity.create({
        data: commonData,
      });

      res.status(201).json(Task);
    } catch (error) {
      console.error("Error creating activity:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  };
};

export const updateActivity = async (
  userId: number,
  projectId: number,
  taskId: number,
  fieldName: string,
  oldValue: string,
  newValue: string,
  next: NextFunction
) => {
  if (!userId) {
    return next(createHttpError(401, "User not Specified"));
  }
  if (!projectId) {
    return next(createHttpError(400, "Project ID is required"));
  }
  if (!taskId) {
    return next(createHttpError(400, "Task ID is required"));
  }

  const activityType = TASKACTIVITYTYPE.UPDATE;
  const insertedData = {
    userId: +userId,
    createdAt: new Date(),
    activityType,
    fieldName,
    projectId: +projectId,
    oldValue,
    taskId: +taskId,
    newValue,
  };

  const activity = await TaskActivity.create({ data: insertedData });
  if (!activity) {
    return next(createHttpError(500, "Error creating update activity"));
  }

  return activity;
};

export const JoinLeaveActivity = (
  activityType: MEMBERSHIPACTIVITYTYPE
): RequestHandler<unknown, unknown, TActivity, unknown> => {
  return async (req, res, next) => {
    const { userId, projectId } = req.body;
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }
    if (!projectId) {
      return next(createHttpError(400, "Project ID is required"));
    }

    const commonData = {
      userId: +userId,
      createdAt: new Date(),
      activityType,
      projectId: +projectId,
    };

    try {
      // Combine common data with specific data based on activity type
      await MembershipActivity.create({
        data: commonData,
      });

      next();
    } catch (error) {
      console.error("Error creating activity:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  };
};
