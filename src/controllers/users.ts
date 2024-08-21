import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import handleUploadImg from "../middleware/ImgUploads/handleUploadImg";
import { userskills } from "../models/skills";
import { teamMember } from "../models/team";
import {
  DeleteBody,
  LoginBody,
  SignUpBody,
  user,
  UserUpdate,
  UserUpdateSkills,
  UserUpdateTeams,
} from "../models/user";
import handleDeleteImg from "../middleware/ImgUploads/handleDeleteImg";

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
  //this is used for file upload if any file is uploaded
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
        name: name,
      },
    });
    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }

    //verify email exsistance
    const existingEmail = await user.findFirst({
      where: {
        email: email,
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

    ///working on profile image
    let uploadPath = "/uploads/profile/default.jpg";
    const newPath = handleUploadImg(req.files?.profileImg);
    if (newPath) {
      uploadPath = newPath;
    }
    //working on skill
    let newUser = null;
    if (!skills) {
      newUser = await user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          age: +age,
          profileImg: uploadPath,
        },
      });
    } else {
      const skillsIds: number[] = skills.map(
        (skill: string | number) => +skill
      );
      //bind user with skills
      newUser = await user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          age: +age,
          profileImg: uploadPath,
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

export const getProfileImage: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id; // Get the user ID from the request parameters

    // Fetch user data from the database
    const userData = await user.findUnique({
      where: { id: Number(userId) },
      select: { profileImg: true }, // Assuming 'profileImg' stores the image path
    });

    if (!userData || !userData.profileImg) {
      return next(createHttpError(404, "Image not found"));
    }
    res.json(userData.profileImg);
  } catch (error) {
    next(error);
  }
};
export const updateUserProfile: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;

  try {
    if (!userId) {
      throw createHttpError(401, "Unauthenticated");
    }
    const userdata = await user.findUnique({
      where: {
        id: +userId,
      },
    });
    if (!userdata) {
      throw createHttpError(404, "User not found");
    }

    //handle Delete Previous Image
    if (
      userdata.profileImg &&
      userdata.profileImg !== "/uploads/profile/default.jpg"
    ) {
      await handleDeleteImg(userdata.profileImg);
    }
    const uploadDirection = handleUploadImg(req.files?.profileImg);
    console.log(uploadDirection);
    if (!uploadDirection) {
      throw createHttpError(400, "Image upload failed");
    }
    await user.update({
      where: {
        id: +userId,
      },
      data: {
        profileImg: uploadDirection,
      },
    });
    res.status(200).json(uploadDirection);
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

    // Create new skills for the user
    await userskills.createMany({
      data: skills.map((skillId) => ({
        userId: +userId,
        skillId: +skillId,
      })),
    });
    //fetchNewSkills
    const newSkills = await userskills.findMany({
      where: {
        userId: +userId,
      },
      include: {
        skill: true,
      },
    });
    const data = newSkills.map((skill) => skill.skill.name);
    res.status(200).json(data);
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
