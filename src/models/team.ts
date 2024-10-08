import prisma from "./PrismaInit";
import { User } from "./user";

export interface TeamCreation {
  name: string;
}

export interface TeamModification {
  name?: string;
  id: number;
}

export interface TeamDeletion {
  id?: number;
}

export interface Team {
  id: number;
  name: string;
  ownerId: string | number;
  createdAt: string;
  updatedAt: string;
}
export interface TeamData {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  members: User[];
}

export interface ResponseToJoin {
  teamId: number;
  userId: string;
  status: string;
}
export const team = prisma.team;
export const teamMember = prisma.teamMember;
