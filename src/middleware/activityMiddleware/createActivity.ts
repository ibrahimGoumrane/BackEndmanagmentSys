import { RequestHandler } from "express";
import { Activity, CreateActivity } from "../../models/activity";
import { ACTIVITYTYPE } from "@prisma/client";
import createHttpError from "http-errors";

export const createActivity = ({
  activityType,
}: CreateActivity): RequestHandler<
  unknown,
  unknown,
  CreateActivity,
  unknown
> => {
  return async (req, res, next) => {
    const { userId } = req.session;
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }
    if (!req.body.projectId) {
      return next(createHttpError(400, "Project ID is required"));
    }

    const commonData = {
      userId,
      createdAt: new Date(),
      activityType,
      projectId: +req.body.projectId,
    };

    let specificData = {};

    switch (activityType) {
      case ACTIVITYTYPE.CREATE:
      case ACTIVITYTYPE.DELETE:
        specificData = { newValue: req.body.newValue };
        break;

      case ACTIVITYTYPE.UPDATE:
        specificData = {
          newValue: req.body.newValue,
          oldValue: req.body.oldValue,
        };
        break;

      case ACTIVITYTYPE.JOIN:
      case ACTIVITYTYPE.LEAVE:
        // No additional data needed for JOIN/LEAVE, just use commonData
        break;

      default:
        return next({
          message: "Invalid activity type provided",
          status: 400,
        });
    }

    try {
      // Combine common data with specific data based on activity type
      await Activity.create({
        data: {
          ...commonData,
          ...specificData,
        },
      });

      res.status(201).json({
        message: "Activity logged successfully",
      });
    } catch (error) {
      console.error("Error creating activity:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  };
};
export const getActivitiesByType: RequestHandler<
  { projectId: string; activityType: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { projectId, activityType } = req.params;
  const { userId } = req.session;

  if (!userId) {
    return next({
      message: "User not authenticated",
      status: 401,
    });
  }

  try {
    const validTypes = [
      ACTIVITYTYPE.CREATE,
      ACTIVITYTYPE.DELETE,
      ACTIVITYTYPE.UPDATE,
      ACTIVITYTYPE.JOIN,
      ACTIVITYTYPE.LEAVE,
    ];
    const normalizedType = activityType.toUpperCase();

    if (!validTypes.includes(normalizedType as ACTIVITYTYPE)) {
      return next({
        message: "Invalid activity type",
        status: 400,
      });
    }

    const activities = await Activity.findMany({
      where: {
        projectId: +projectId,
        activityType: normalizedType as ACTIVITYTYPE,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(activities);
  } catch (error) {
    console.error("Error getting activities:", error);
    next(error);
  }
};
