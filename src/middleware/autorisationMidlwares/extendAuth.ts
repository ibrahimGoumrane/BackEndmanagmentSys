import { RequestHandler } from "express";
import {
  Autorisation,
  autorisationModelInputs,
  updateDeleteAuth,
} from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";
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
      next({
        message: "User not authenticated or no " + userId + " Provided",
      });
    }
    if (!moduleId) {
      next({
        message: "No " + moduleId + " Provided",
      });
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
    checkData({ userId, moduleId })(
      req,
      res,
      async (err) => {
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
            return next({ message: "Failed to give authorisation" });
          }
          return res.status(200).json({
            message: "Authorisation given successfully",
          });
        } catch (error) {
          console.error("Authorization check failed:", error);
          next(error);
        }
      }
    );
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
          return res.status(404).json({
            message: "Authorization not found or update failed",
          });
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

export const deleteAuth = (
): RequestHandler<unknown, unknown, updateDeleteAuth, unknown> => {
  return async (req, res, next) => {
    const { id } = req.body;
    try {
      const deletedAuth = await Autorisation.delete({
        where: { id: +id },
      });

      if (!deletedAuth) {
        return res.status(404).json({
          message: "Authorization not found or delete failed",
        });
      }

      return res.status(200).json({
        message: "Authorization deleted successfully",
      });
    } catch (error) {
      console.error("Authorization delete failed:", error);
      next(error);
    }
  };
};
