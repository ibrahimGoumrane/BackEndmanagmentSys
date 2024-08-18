import { TASKACTIVITYTYPE, MEMBERSHIPACTIVITYTYPE } from "@prisma/client";
import prisma from "./PrismaInit";
export interface CreateActivity {
  activityType: TASKACTIVITYTYPE;
  userId?: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: Date;
  updatedAt?: Date;
  projectId: number;
  taskId?: number;
}

export interface getMemebersActivity {
  userId: string;
  activityType: MEMBERSHIPACTIVITYTYPE;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}
export interface getCreateDeleteActivity {
  userId: string;
  value: string;
  activityType: TASKACTIVITYTYPE;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}
export interface getUpdateActivity {
  userId: string;
  oldValue: string;
  newValue: string;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}
export const TaskActivity = prisma.taskActivity;
export const MembershipActivity = prisma.projectMembershipActivity;
