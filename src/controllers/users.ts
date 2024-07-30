import { RequestHandler } from "express";
import {
  DeleteBody,
  LoginBody,
  SignUpBody,
  user,
  UserUpdate,
  UserUpdateSkills,
  UserUpdateTeams,
} from "../models/user";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { userskills } from "../models/skills";
import { teamMember } from "../models/team";

export const getLoggedInUser: RequestHandler = async (req, res, next) => {
  const userId = req.session.userId;
  try {
    const authenticatedUser = await user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!authenticatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(authenticatedUser);
  } catch (error) {
    next(error);
  }
};
export const getUserData: RequestHandler<
  DeleteBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const authenticatedUser = await user.findUnique({
      where: {
        id: +id,
      },
    });
    if (!authenticatedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json(authenticatedUser);
  } catch (error) {
    next(error);
  }
};
export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const {
    name = "",
    email = "",
    password: passwordRaw = "",
    age,
    skills,
  } = req.body;
  try {
    //verify username exsistance
    const existingUsername = await user.findFirst({
      where: {
        name: name, // Provide the email property here
      },
    });
    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }
    //verify email exsistance
    const existingEmail = await user.findFirst({
      where: {
        email: email, // Provide the email property here
      },
    });
    if (existingEmail) {
      throw createHttpError(409, "Email already exists");
    }

    //verify password
    if (passwordRaw.length < 8) {
      throw createHttpError(400, "Password must be at least 8 characters");
    }
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    //working on skill
    let newUser = null;

    if (!skills) {
      newUser = await user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          age: +age,
        },
      });
    } else {
      const skillsIds = skills.map((skill) => +skill);
      //bind user with skills
      newUser = await user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          age: +age,
          UserSkill: {
            createMany: {
              data: skillsIds.map((skillId: number) => ({
                skillId: skillId,
              })),
            },
          },
        },
      });
    }

    req.session.userId = newUser.id;
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const logIn: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const { name = "", password = "" } = req.body;
  try {
    const existingUser = await user.findFirst({
      where: {
        name: name, // Provide the email property here
      },
    });
    if (!existingUser) {
      throw createHttpError(404, "User not found");
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid password");
    }
    req.session.userId = existingUser.id;
    res.status(200).json(existingUser);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return next(createHttpError(500, "Failed to logout"));
      }
      res.clearCookie("sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser: RequestHandler<
  DeleteBody,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await user.delete({
      where: {
        id: +id,
      },
    });
    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler<
  unknown,
  unknown,
  UserUpdate,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;
  const { name, email, age } = req.body;

  try {
    if (!userId) {
      throw createHttpError(401, "Unauthenticated ");
    }
    const updatedUser = await user.update({
      where: {
        id: +userId,
      },
      data: {
        name,
        email,
        age: +age,
      },
    });
    if (!updatedUser) {
      throw createHttpError(404, "User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
export const updateUserSkills: RequestHandler<
  unknown,
  unknown,
  UserUpdateSkills,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;
  const { skills } = req.body;

  try {
    // Ensure userId is available
    if (!userId) {
      throw createHttpError(400, "User ID is missing in session");
    }

    // Delete all existing skills for the user
    await userskills.deleteMany({
      where: {
        userId: +userId,
      },
    });

    // Create new skills for the user
    const newUserSkills = await userskills.createMany({
      data: skills.map((skillId) => ({
        userId: +userId,
        skillId: +skillId,
      })),
    });

    res.status(200).json(newUserSkills);
  } catch (error) {
    next(error);
  }
};

export const updateUserTeams: RequestHandler<
  unknown,
  unknown,
  UserUpdateTeams,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;
  const { teams } = req.body;

  try {
    // Ensure userId is available
    if (!userId) {
      throw createHttpError(400, "User ID is missing in session");
    }

    // Delete all existing skills for the user
    await teamMember.deleteMany({
      where: {
        userId: +userId,
      },
    });

    // Create new skills for the user
    const newTeamMembers = await teamMember.createMany({
      data: teams.map((team) => ({
        userId: +userId,
        teamId: +team.id,
      })),
    });

    res.status(200).json(newTeamMembers);
  } catch (error) {
    next(error);
  }
};
