import { PrismaClient, ModuleType, Action } from "@prisma/client";
import { ParsedQs } from "qs";

const prisma = new PrismaClient();
export interface autorisationModel {
  id: string;
  userId: string;
  moduleId: string;
  moduleType: ModuleType;
  action: Action;
  createdAt: Date;
}
export interface autorisationModelInputs {
  userId: string;
  moduleId: string;
}
export interface updateDeleteAuth {
  id: string;
  userId: string;
  moduleId: string;
}
// Define your extended query type
export interface ExtendedQuery extends ParsedQs {
  moduleId?: string; // Or use the appropriate type if it's a number
  userId?: string; // Or use the appropriate type if it's a number
  projectId?: string;
}
export interface Params {
  id?: number;
}

export const Autorisation = prisma.authorization;
