import { TASKACTIVITYTYPE } from "@prisma/client";
import prisma from "./PrismaInit";
export interface TActivity {
  activityType: TASKACTIVITYTYPE;
  userId?: string;
  oldValue?: string;
  fieldName?: string;
  newValue?: string;
  createdAt?: Date;
  updatedAt?: Date;
  projectId: number;
  taskId?: number;
}

export const TaskActivity = prisma.taskActivity;
export const MembershipActivity = prisma.projectMembershipActivity;
