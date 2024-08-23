import { RequestHandler } from "express";
import { Autorisation, ExtendedQuery } from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";
import createHttpError from "http-errors";

const checkAuthorization = (
  moduleType: ModuleType,
  action: Action
): RequestHandler<unknown, unknown, unknown, ExtendedQuery> => {
  return async (req, res, next) => {
    const { userId } = req.session; // Assuming userId is stored in the session
    const { moduleId } = req.query; // Assuming the module ID is in the request params

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!moduleId) {
      return res.status(401).json({
        message: "No " + moduleType + " Provided",
      });
    }

    try {
      const authorization = await Autorisation.findFirst({
        where: {
          userId,
          moduleId: +moduleId,
          moduleType,
          action,
        },
      });
      console.log(userId, moduleId, authorization);

      if (!authorization) {
        return next(createHttpError(403, "Unauthorized"));
      }
      return next();
    } catch (error) {
      console.error("Authorization check failed:", error);
      next(error);
    }
  };
};

export default checkAuthorization;
