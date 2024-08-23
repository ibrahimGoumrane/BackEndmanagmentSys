import { RequestHandler } from "express";
import { TASKACTIVITYTYPE, MEMBERSHIPACTIVITYTYPE } from "@prisma/client";
import { MembershipActivity, TaskActivity } from "../../models/activity";
import createHttpError from "http-errors";

export const getActivitiesByType: RequestHandler<
  { projectId: string; activityType: string },
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { projectId, activityType } = req.params;
  const { userId } = req.session;

  if (!userId) {
    return next(createHttpError(401, "User not authenticated"));
  }

  try {
    const validTypes = [
      TASKACTIVITYTYPE.CREATE,
      TASKACTIVITYTYPE.DELETE,
      TASKACTIVITYTYPE.UPDATE,
      MEMBERSHIPACTIVITYTYPE.JOIN,
      MEMBERSHIPACTIVITYTYPE.LEAVE,
    ];
    const normalizedType = activityType.toUpperCase();

    if (
      !validTypes.includes(normalizedType as TASKACTIVITYTYPE) &&
      !validTypes.includes(normalizedType as TASKACTIVITYTYPE)
    ) {
      return next(createHttpError(400, "Invalid activity type"));
    }

    const validTaskTypes = Object.values(TASKACTIVITYTYPE) as string[];

    if (validTaskTypes.includes(normalizedType)) {
      const activities = await TaskActivity.findMany({
        where: {
          projectId: +projectId,
          activityType: normalizedType as TASKACTIVITYTYPE,
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json(activities);
    } else {
      const activities = await MembershipActivity.findMany({
        where: {
          projectId: +projectId,
          activityType: normalizedType as MEMBERSHIPACTIVITYTYPE,
        },
        orderBy: { createdAt: "desc" },
      });
      return res.json(activities);
    }
  } catch (error) {
    console.error("Error getting activities:", error);
    next(error);
  }
};
