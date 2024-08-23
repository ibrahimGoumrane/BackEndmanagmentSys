import { RequestHandler } from "express";
import {
  Autorisation,
  autorisationModelInputs,
  updateDeleteAuth,
} from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";
import createHttpError from "http-errors";
const checkData = ({
  userId,
  moduleId,
}: autorisationModelInputs): RequestHandler<
  unknown,
  unknown,
  autorisationModelInputs,
  unknown
> => {
  return (req, res, next) => {
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }
    if (!moduleId) {
      return next(createHttpError(401, "No moduleId Provided"));
    }
    next();
  };
};

export const extendAuth = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<unknown, unknown, autorisationModelInputs, unknown> => {
  return async (req, res, next) => {
    const { userId, moduleId } = req.body;

    // Call the checkData middleware function
    checkData({ userId, moduleId })(req, res, async (err) => {
      if (err) return next(err);

      try {
        const newAuthorisation = await Autorisation.create({
          data: {
            userId: +userId,
            moduleId: +moduleId,
            moduleType,
            action,
          },
        });
        if (!newAuthorisation) {
          return next(createHttpError(403, "Unauthorized"));
        }
        return res.status(200).json({
          message: "Authorisation given successfully",
        });
      } catch (error) {
        console.error("Authorization check failed:", error);
        next(error);
      }
    });
  };
};
export const updateAuth = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<unknown, unknown, updateDeleteAuth, unknown> => {
  return async (req, res, next) => {
    const { id, userId, moduleId } = req.body;

    // Call the checkData middleware function
    checkData({ userId, moduleId })(req, res, async (err) => {
      if (err) return next(err);
      try {
        const updatedAuth = await Autorisation.update({
          where: { id: +id },
          data: {
            userId: +userId,
            moduleId: +moduleId,
            moduleType,
            action,
          },
        });

        if (!updatedAuth) {
          return next(createHttpError(403, "Unauthorized"));
        }

        return res.status(200).json({
          message: "Authorization updated successfully",
          updatedAuth,
        });
      } catch (error) {
        console.error("Authorization update failed:", error);
        next(error);
      }
    });
  };
};

export const deleteAuth = (): RequestHandler<
  unknown,
  unknown,
  updateDeleteAuth,
  unknown
> => {
  return async (req, res, next) => {
    const { id } = req.body;
    try {
      const deletedAuth = await Autorisation.delete({
        where: { id: +id },
      });

      if (!deletedAuth) {
        return next(createHttpError(403, "Unauthorized"));
      }

      return res.status(200).json({
        message: "Authorization deleted successfully",
        deletedAuth,
      });
    } catch (error) {
      console.error("Authorization delete failed:", error);
      next(error);
    }
  };
};
