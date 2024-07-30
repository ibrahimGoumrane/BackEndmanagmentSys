import prisma from "./PrismaInit";

export interface ActivityCreation {
  description: string;
  taskId: number;
}
export interface ActivityId {
  id: string;
}
export const activity = prisma.activity;
