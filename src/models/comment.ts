import prisma from "./PrismaInit";

export interface commentCreation {
  content: string;
  taskId: number;
  userId: number;
}
export interface commentUpdate {
  content?: string;
  taskId?: number;
  userId?: number;
}
export interface commentId {
  id: string;
}
export interface commentData{
  id: number;
  content: string;
  taskId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
export const comment = prisma.comment;
