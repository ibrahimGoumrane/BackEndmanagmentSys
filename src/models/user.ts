import prisma from "./PrismaInit";
import { Team } from "./team";

export interface LoginBody {
  name?: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  age: number;
  skills: string;
  createdAt: string;
  updatedAt: string;
}
export interface Member {
  id: string;
  name: string;
  email: string;
}
export interface UserUpdate {
  name: string;
  email?: string;
  age: number;
}
export interface UserUpdateSkills {
  skills: string[];
}
export interface UserUpdateTeams {
  teams: Team[];
}

export interface SignUpBody {
  name?: string;
  email?: string;
  password?: string;
  age: number;
  skills?: string[];
  profileImg?: FileList;
}
export interface DeleteBody {
  id: string;
}
export const user = prisma.user;
