import { RequestHandler } from "express";
import {
  team,
  teamMember,
  TeamDeletion,
  Team,
  TeamCreation,
  TeamData,
  ResponseToJoin,
} from "../models/team";
import createHttpError from "http-errors";
import { user, User } from "../models/user";
import emailSender from "../middleware/emailHandler/emailSender";
import {
  acceptanceRequestTeamEmail,
  emailRequestTeamTemplate,
  rejectionRequestTeamEmail,
} from "../middleware/emailTemplates/teamEmail";
import { Params } from "../models/autorisation";
import { projectRoot } from "../app";
import path from "path";
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
        NOT: {
          members: {
            some: {
              userId: Number(req.session.userId),
            },
          },
        },
      },
      take: 30,
      orderBy: {
        name: "asc",
      },
    });
    res.status(200).json(teams);
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
        user: {
          include: {
            UserSkill: {
              select: {
                skill: true,
              },
            },
          },
        },
      },
    });
    if (!userTeams) {
      throw createHttpError(404, "there is no user in this team");
    }

    const returnValue = userTeams.map((user) => ({
      ...user.user,
      skills: user.user.UserSkill.map((skill) => skill.skill.name),
    }));
    res.status(200).json(returnValue);
  } catch (error) {
    next(error);
  }
};
export const requestJoin: RequestHandler<
  unknown,
  unknown,
  TeamData,
  unknown
> = async (req, res, next) => {
  const { name, id, ownerEmail } = req.body;
  const { userId } = req.session;
  try {
    const NewUser = await user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!NewUser) {
      throw createHttpError(401, "User not authenticated");
    }

    //Sending the email

    const mailData = {
      from: NewUser.email, // Who is sending the letter
      to: ownerEmail, // Who is receiving the letter
      subject: "Request TO Join YOur Group Chat : " + name, // The title of the letter
      text: "That was easy!", // The simple message inside the letter
      html: emailRequestTeamTemplate(
        NewUser.id.toString(),
        id.toString(),
        NewUser.name
      ), // A fancy message inside the letter with bold text
    };
    emailSender(mailData)
      .then(() => {
        res.status(200).json({ message: "Email sent successfully" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const handleReponseRequestJoin: RequestHandler<
  unknown,
  unknown,
  unknown,
  ResponseToJoin
> = async (req, res, next) => {
  const { teamId, userId, status } = req.query;
  try {
    const NewUser = await user.findFirst({
      where: {
        id: +userId,
      },
    });
    if (!NewUser) {
      throw createHttpError(401, "User not authenticated");
    }
    const teamObj = await team.findFirst({
      where: {
        id: +teamId,
      },
    });

    let html;
    if (status === "ACCEPTED") {
      const teamLink = await teamMember.create({
        data: {
          userId: +userId,
          teamId: +teamId,
        },
      });
      if (!teamLink) {
        return setTimeout(() => {
          res
            .status(400)
            .send(
              `<h1>There was an error while trying to add the user to the team</h1>`
            );
        }, 1000);
      }
      html = acceptanceRequestTeamEmail(NewUser.name); // A fancy message inside the letter with bold text
    } else {
      html = rejectionRequestTeamEmail(NewUser.name); // A fancy message inside the letter with bold text
    }
    const mailData = {
      from: "goumrane.ibrahim@ensam-casa.ma", // Who is sending the letter
      to: NewUser?.email, // Who is receiving the letter
      subject:
        "Response of Your Request To Join the groupe Chat : " + teamObj?.name, // The title of the letter
      text: "That was easy!", // The simple message inside the letter
      html, // A fancy message inside the letter with bold text
    };
    emailSender(mailData)
      .then(() => {})
      .catch((error) => {
        next(error);
      });
    res.status(200).send(
      `  <html>
          <head>
              <meta http-equiv="refresh" content="3;url=http://localhost:5173/home/" />
          </head>
          <body>
            <h1>Your response has been registered successfully. The user has been ${
              status === "ACCEPTED" ? "ACCEPTED" : "REJECTED"
            }</h1>
              <h1>Redirecting in 3 seconds...</h1>
          </body>
      </html>`
    );
  } catch (error) {
    next(error);
  }
};

export const createTeam: RequestHandler<
  Params,
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
    const uploadPath = projectRoot + "\\uploads\\team\\default.jpg";

    const newTeam = await team.create({
      data: {
        name,
        ownerId: userId,
        teamImage: uploadPath,
      },
    });
    await teamMember.create({
      data: {
        userId,
        teamId: newTeam.id,
      },
    });

    req.params.id = newTeam.id;
    next();
  } catch (error) {
    next(error);
  }
};
export const getTeamImage: RequestHandler<
  TeamDeletion,
  unknown,
  TeamCreation,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.session;
  try {
    if (!userId) {
      throw createHttpError(401, "User not authenticated");
    }
    const teamExsist = await team.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!teamExsist) {
      throw createHttpError(400, "Team already exists");
    }
    const imageUrl = `/uploads/team/${path.basename(teamExsist.teamImage ?? "")}`;
    res.json(imageUrl);
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
  if (!id) {
    throw createHttpError(400, "Team ID is required");
  }
  try {
    const teamUserBound = await teamMember.findFirst({
      where: {
        teamId: +id,
        userId: +userId,
      },
    });
    console.log(teamUserBound);
    if (!teamUserBound) {
      throw createHttpError(404, "User not in the team or team not found");
    }
    await teamMember.delete({
      where: {
        id: teamUserBound.id,
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
