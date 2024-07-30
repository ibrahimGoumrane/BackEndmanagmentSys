import { RequestHandler } from "express";
import { team, projectTeamAssociation, teamMember } from "../models/team";
import createHttpError from "http-errors";
import { user } from "../models/user";

export const getTeams: RequestHandler = async (req, res, next) => {
  const { query } = req.query;
  if (typeof query !== "string") {
    return res.status(400).json({ message: "Invalid query" });
  }
  try {
    const teams = await team.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: 10,
    });
    res.status(200).json({ teams });
  } catch (error) {
    next(error);
  }
};
export const getProjectTeam: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectTeams = await projectTeamAssociation.findMany({
      where: {
        projectId: Number(id),
      },
      include: {
        team: true,
      },
    });
    if (!projectTeams) {
      throw createHttpError(404, "There is no Teams in this project");
    }

    res.status(200).json({ projectTeams });
  } catch (error) {
    next(error);
  }
};
export const getUserTeam: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userTeams = await teamMember.findMany({
      where: {
        userId: Number(id),
      },
      include: {
        team: true,
      },
    });
    if (!userTeams) {
      throw createHttpError(404, "This user is not envolved in any team");
    }
    const returnValue = userTeams.map((team) => team.team);
    res.status(200).json(returnValue);
  } catch (error) {
    next(error);
  }
};
export const createTeam: RequestHandler = async (req, res, next) => {
  const { name } = req.body;
  try {
    const teamExsist = await team.findFirst({
      where: {
        name,
      },
    });
    if (teamExsist) {
      throw createHttpError(400, "Team already exists");
    }
    const newTeam = await team.create({
      data: {
        name,
      },
    });

    res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};
export const addUserTeam: RequestHandler = async (req, res, next) => {
  const { userId } = req.session;
  const { id } = req.params;
  try {
    if (!userId || !id) {
      throw createHttpError(400, "User ID and Team ID are required");
    }
    const teamExsist = await team.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!teamExsist) {
      throw createHttpError(404, "Team not found");
    }
    const userExsist = await user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!userExsist) {
      throw createHttpError(404, "User not found");
    }

    const userTeamExsist = await teamMember.findFirst({
      where: {
        userId,
        teamId: Number(id),
      },
    });
    if (userTeamExsist) {
      throw createHttpError(400, "User already in this team");
    }
    const newUserTeam = await teamMember.create({
      data: {
        userId: userId,
        teamId: Number(id),
      },
    });
    res.status(201).json(newUserTeam);
  } catch (error) {
    next(error);
  }
};
export const updateTeam: RequestHandler = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;
  try {
    const teamExsist = await team.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!teamExsist) {
      throw createHttpError(404, "Team not found");
    }
    const newTeam = await team.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    res.status(200).json(newTeam);
  } catch (error) {
    next(error);
  }
};
export const deleteTeam: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamExsist = await team.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!teamExsist) {
      throw createHttpError(404, "Team not found");
    }
    await team.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    next(error);
  }
};
