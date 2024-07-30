import { RequestHandler } from "express";
import {
  AddSkillsBody,
  getskill,
  removeSkills,
  skill as skillModel,
  userskills,
} from "../models/skills";
import createHttpError from "http-errors";

export const addSkills: RequestHandler<
  unknown,
  unknown,
  AddSkillsBody,
  unknown
> = async (req, res, next) => {
  const skills = req.body.skills;

  try {
    if (skills instanceof Array) {
      skills.forEach(async (skill) => {
        const ExsistingSkill = await skillModel.findFirst({
          where: {
            name: skill,
          },
        });
        if (ExsistingSkill)
          throw createHttpError(409, "The Skill already exist");
        await skillModel.create({
          data: {
            name: skill,
          },
        });
      });
    } else {
      const ExsistingSkill = await skillModel.findFirst({
        where: {
          name: skills,
        },
      });
      if (ExsistingSkill) throw createHttpError(409, "The Skill already exist");
      skillModel.create({
        data: {
          name: skills,
        },
      });
    }
    res.status(201).json({ message: "skills added" });
  } catch (error) {
    next(error);
  }
};
export const removeSkill: RequestHandler<
  removeSkills,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const skillId = +req.params.id;
  try {
    const ExsistingSkill = await skillModel.findFirst({
      where: {
        id: skillId,
      },
    });
    if (!ExsistingSkill) throw createHttpError(404, "The skill does not exist");
    await skillModel.delete({
      where: {
        id: skillId,
      },
    });
    res.status(200).json({ message: "skill removed" });
  } catch (error) {
    next(error);
  }
};
export const getSkill: RequestHandler<
  getskill,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const userId = +req.params.id;
  try {
    const skillsRel = await userskills.findMany({
      where: {
        userId: {
          equals: userId,
        },
      },
    });
    const skillIds = skillsRel.map((skill) => skill.skillId);
    const skills = await skillModel.findMany({
      where: {
        id: {
          in: skillIds,
        },
      },
      select: {
        name: true,
      },
    });
    const skillNames = skills.map((skill) => skill.name);
    if (!skills) throw createHttpError(404, "Skill not found");
    res.status(200).json(skillNames);
  } catch (error) {
    next(error);
  }
};

export const getSkills: RequestHandler = async (req, res, next) => {
  try {
    const skills = await skillModel.findMany();
    res.status(200).json(skills);
  } catch (error) {
    next(error);
  }
};
