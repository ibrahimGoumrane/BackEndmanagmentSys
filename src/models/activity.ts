import { ACTIVITYTYPE } from "@prisma/client";
import prisma from "./PrismaInit";
export interface CreateActivity {
  activityType: ACTIVITYTYPE;
  userId: string;
  oldValue?: string;
  newValue?: string;
  createdAt?: Date;
  updatedAt?: Date;
  projectId?: string;
}

export interface getMemebersActivity {
  userId: string;
  activityType: ACTIVITYTYPE;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}
export interface getCreateDeleteActivity {
  userId: string;
  value: string;
  activityType: ACTIVITYTYPE;
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
export const Activity = prisma.activity;
