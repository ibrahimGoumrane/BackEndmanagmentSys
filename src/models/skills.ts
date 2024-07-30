import prisma from "./PrismaInit";

export interface Skill {
  id: string;
  name: string;
}
export interface AddSkillsBody {
  skills: string[] | string;
}
export interface removeSkills {
  id: number;
}
export interface getskill {
  id: number;
}
export interface bindSkillUser {
  skillId: number;
  userId: number;
}

export const skill = prisma.skill;
export const userskills = prisma.userSkill;
