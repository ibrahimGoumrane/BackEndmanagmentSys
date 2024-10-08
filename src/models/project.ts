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
export interface getProjectData {
  id: number;
  name: string;
  startDate: string;
  ManagerName: string;
  description: string;
  statusName: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProjectModifDelete {
  id?: number;
}

export interface ProjectSearch {
  search: string;
}
export interface ResponseToJoin {
  projectId: number;
  userId: string;
  status: string;
}
export const project = prisma.project;
export const projectMemeberAssociation = prisma.projectMemberAssociation;
