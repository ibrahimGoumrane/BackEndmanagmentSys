import prisma from "./PrismaInit";

export interface taskCreation {
  name: string;
  projectId: number;
  creatorId:number;
  statusId:number;
}

export interface taskModif {
  name: string;
  assigneeId?: number;
  StoryPoint?: number;
  endDate?: Date;
  label?: string;
  parentId?: number;
  statusId: number;
  description?: string;
  projectId: number;
  id: number;
}
export interface taskDeletion {
  id: number;
}

export interface task {
  id: number;
  name: string;
  description?: string;
  assigneeId?: number;
  storyPoint?: number;
  endDate?: Date;
  label?: string;
  startDate?: Date;
  parentId?: number;
  statusId?: number;
  createdAt: string;
  updatedAt: string;
  creatorId:number;
}
export default prisma.task;
