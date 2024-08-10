import prisma from "./PrismaInit";

export interface TChat {
  id: string;
  teamId: string;
  userId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UChat {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AttachmentData {
  id: string;
  teamChatId?: string;
  userChatId?: string;
  fileName: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export const TeamChat = prisma.teamChat;
export const UserChat = prisma.userChat;
export const Attachment = prisma.attachment;
