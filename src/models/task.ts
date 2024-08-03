import prisma from "./PrismaInit";

export interface taskCreation {
  name: string;
  projectId: number;
  creatorId: number;
  statusId: number;
}

export interface taskModif {
  name: string;
  AssigneeId?: number;
  StoryPoint?: number;
  endDate?: string;
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
  AssigneeId?: number;
  storyPoint?: number;
  endDate?: string;
  label?: string;
  startDate?: string;
  parentId?: number;
  statusId?: number;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
}
export default prisma.task;
