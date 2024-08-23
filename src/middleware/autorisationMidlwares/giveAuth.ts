import { RequestHandler } from "express";
import { Autorisation, Params } from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";
import createHttpError from "http-errors";

const giveAuth = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<Params, unknown, unknown, unknown> => {
  return async (req, res, next) => {
    const { userId } = req.session;
    const { id: moduleId } = req.params; // Assuming userId is stored in the session
    if (!userId) {
      return next(createHttpError(401, "User not authenticated"));
    }
    if (!moduleId) {
      return next(createHttpError(401, "No " + moduleType + " Provided"));
    }
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
      next();
    } catch (error) {
      console.error("Authorization check failed:", error);
      next(error);
    }
  };
};
export default giveAuth;
