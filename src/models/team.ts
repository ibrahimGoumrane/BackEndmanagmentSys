import prisma from "./PrismaInit";

export interface TeamCreation {
  name: string;
}

export interface TeamModification {
  name?: string;
  id: number;
}

export interface TeamDeletion {
  id: number;
}

export interface Team {
  id: number;
  name: string;
  ownerId: string | number;
  createdAt: string;
  updatedAt: string;
}
export const team = prisma.team;
export const teamMember = prisma.teamMember;
