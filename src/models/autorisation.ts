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

// Define your extended query type
export interface ExtendedQuery extends ParsedQs {
  moduleId?: string; // Or use the appropriate type if it's a number
}

export const Autorisation = prisma.authorization;
