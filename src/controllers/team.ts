import { RequestHandler } from "express";
import {
  team,
  teamMember,
  TeamDeletion,
  Team,
  TeamCreation,
} from "../models/team";
import createHttpError from "http-errors";
import { User, user } from "../models/user";

export const getTeams: RequestHandler<
  unknown,
  unknown,
  unknown,
  { name: string }
> = async (req, res, next) => {
  const { name } = req.query;
  if (typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }
  try {
    const teams = await team.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
};

export const getTeamByUserId: RequestHandler<
  TeamDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamData = await teamMember.findMany({
      where: {
        userId: Number(id),
      },
      select: {
        team: true,
      },
    });
    if (!teamData) {
      throw createHttpError(404, "This user is not envolved in any team");
    }
    const Teams = teamData.map((team) => team.team);
    res.status(200).json(Teams);
  } catch (error) {
    next(error);
  }
};
export const getTeam: RequestHandler<
  TeamDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamData = await team.findFirst({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(teamData);
  } catch (error) {
    next(error);
  }
};
export const getTeamData: RequestHandler<
  TeamDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const teamData = await team.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        name: true,
        id: true,
      },
    });
    const teamMembers = await team.findMany({
      where: {
        id: Number(id),
      },
    });
    const returnedData = {
      id: teamData?.id,
      name: teamData?.name,
      ownerName: teamData?.owner.name,
      ownerEmail: teamData?.owner.email,
      members: teamMembers,
    };
    res.status(200).json(returnedData);
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
export const getTeamMembers: RequestHandler<
  TeamDeletion,
  unknown,
  User,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userTeams = await teamMember.findMany({
      where: {
        teamId: Number(id),
      },
      include: {
        user: true,
      },
    });
    if (!userTeams) {
      throw createHttpError(404, "there is no user in this team");
    }
    const returnValue = userTeams.map((user) => user.user);
    res.status(200).json(returnValue);
  } catch (error) {
    next(error);
  }
};
export const createTeam: RequestHandler<
  unknown,
  unknown,
  TeamCreation,
  unknown
> = async (req, res, next) => {
  const { name } = req.body;
  const { userId } = req.session;
  try {
    const teamExsist = await team.findFirst({
      where: {
        name,
      },
    });
    if (!userId) {
      throw createHttpError(401, "User not authenticated");
    }
    if (teamExsist) {
      throw createHttpError(400, "Team already exists");
    }
    const newTeam = await team.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    await teamMember.create({
      data: {
        userId,
        teamId: newTeam.id,
      },
    });
    res.status(201).json(newTeam);
  } catch (error) {
    next(error);
  }
};
export const addUserTeam: RequestHandler<
  TeamDeletion,
  unknown,
  User,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;
  const { id } = req.params;
  const NewuserId = req.body.id;
  try {
    if (!NewuserId || !id) {
      throw createHttpError(400, "User ID and Team ID are required");
    }
    if (!userId) {
      throw createHttpError(401, "User not authenticated");
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
        id: +NewuserId,
      },
    });
    if (!userExsist) {
      throw createHttpError(404, "User not found");
    }

    const userTeamExsist = await teamMember.findFirst({
      where: {
        userId: +NewuserId,
        teamId: Number(id),
      },
    });
    if (userTeamExsist) {
      throw createHttpError(400, "User already in this team");
    }
    const newUserTeam = await teamMember.create({
      data: {
        userId: +NewuserId,
        teamId: Number(id),
      },
    });
    if (newUserTeam) {
      throw createHttpError(400, "An error occured during user creation");
    }
    return next();
  } catch (error) {
    next(error);
  }
};
export const updateTeam: RequestHandler<
  TeamDeletion,
  unknown,
  Team,
  unknown
> = async (req, res, next) => {
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
export const deleteTeamMember: RequestHandler<
  TeamDeletion,
  unknown,
  User,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.body.id;
  try {
    const teamUserBound = await teamMember.findFirst({
      where: {
        id: Number(id),
        userId: +userId,
      },
    });
    if (!teamUserBound) {
      throw createHttpError(404, "User not in the team or team not found");
    }
    await teamMember.delete({
      where: {
        id: +id,
        userId: +userId,
      },
    });
    return next();

    res.status(200).json({ message: "Team User Bound deleted" });
  } catch (error) {
    next(error);
  }
};
export const deleteTeam: RequestHandler<
  TeamDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
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
