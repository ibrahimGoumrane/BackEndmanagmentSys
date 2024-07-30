import prisma from "./PrismaInit";

export interface statusCreation {
  name: string;
  projectId: string | number;
}
export interface statusDeletion {
  id: number;
}

export interface ProjectStatus {
  id: number;
  name: string;
}
export interface TaskStatus {
  id: number;
  name: string;
  projectId: string | number | null;
}
export const Projectstatus = prisma.projectStatus;
export const Taskstatus = prisma.taskStatus;
