import prisma from "./PrismaInit";

export interface ProjectCreation {
  name: string;
  description: string;
}
export interface ProjectUpdate {
  name?: string;
  description?: string;
  estimatedDuration?: string;
  startDate?: string;
  endDate?: string;
  ManagerId?: number;
  statusId?: number;
}

export interface ProjectModifDelete {
  id?: number;
}

export interface ProjectSearch {
  search: string;
}

export const project = prisma.project;
export const projectTeamAssociation = prisma.projectTeamAssociation;
export const projectMemeberAssociation = prisma.projectMemberAssociation;
