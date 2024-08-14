import { PrismaClient, ModuleType, Action } from "@prisma/client";
import { ParsedQs } from "qs";
import { Member } from "./user";

const prisma = new PrismaClient();
export interface autorisationModelInputs {
  userId: string;
  moduleId: string;
}
export interface updateDeleteAuth {
  id: string;
  userId: string;
  moduleId: string;
}
export interface autorisationModel extends Member {
  auth: authorisation[];
}
export interface authorisation {
  id: string;
  moduleId: string;
  moduleType: ModuleType;
  action: Action;
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
