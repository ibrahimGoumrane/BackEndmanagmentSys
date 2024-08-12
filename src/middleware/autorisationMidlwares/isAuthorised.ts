import { RequestHandler } from "express";
import { Autorisation, ExtendedQuery } from "../../models/autorisation";
import { Action, ModuleType } from "@prisma/client";

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

    try {
      if (!moduleId) return next(); // User is authorized, proceed to the next middleware/controller

      const authorization = await Autorisation.findFirst({
        where: {
          userId,
          moduleId: +moduleId,
          moduleType,
          action,
        },
      });

      if (!authorization) {
        return res.status(403).json({
          message:
            "Forbidden: You do not have permission to perform this action",
        });
      }
    } catch (error) {
      console.error("Authorization check failed:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default checkAuthorization;
