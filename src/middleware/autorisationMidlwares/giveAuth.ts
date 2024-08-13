import { RequestHandler } from "express";
import { Autorisation, ExtendedQuery } from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";

const giveAuthorisation = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<unknown, unknown, unknown, ExtendedQuery> => {
  return async (req, res, next) => {
    const { userId, moduleId } = req.query; // Assuming userId is stored in the session
    if (!userId || !moduleId) {
      return res.status(401).json({
        message: "User not authenticated or no " + moduleType + " Provided",
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
      return res.status(200).json(newAuthorisation);
    } catch (error) {
      console.error("Authorization check failed:", error);
      next(error);
    }
  };
};
export default giveAuthorisation;
