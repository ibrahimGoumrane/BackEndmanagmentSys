import { PrismaClient , ModuleType , Action } from "@prisma/client";
const prisma = new PrismaClient();
export interface autorisationModel {
  id: string;
  userId: string;
  moduleId: string;
  moduleType: ModuleType;
  action: Action;
  createdAt: Date;
}

export const Autorisation = prisma.authorization;

