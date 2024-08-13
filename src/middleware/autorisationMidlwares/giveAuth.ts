import { RequestHandler } from "express";
import { Autorisation, Params } from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";

const giveAuth = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<Params, unknown, unknown, unknown> => {
  return async (req, res, next) => {
    const { userId } = req.session;
    const { id: moduleId } = req.params; // Assuming userId is stored in the session
    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated or no " + moduleType + " Provided",
      });
    }
    if (!moduleId) {
      return res.status(401).json({
        message: "No " + moduleType + " Provided",
      });
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
        return next({ message: "Failed to give authorisation" });
      }
      next();
    } catch (error) {
      console.error("Authorization check failed:", error);
      next(error);
    }
  };
};
export default giveAuth;
