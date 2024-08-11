import { RequestHandler } from "express";
import {
  TChat,
  UChat,
  AttachmentData,
  TeamChat,
  UserChat,
  Attachment,
} from "../models/chat";
import createHttpError from "http-errors";

export const getTeamChat: RequestHandler<
  TChat,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id: teamId } = req.params;

    if (!teamId) {
      throw createHttpError(400, "Team ID is required");
    }

    const teamChats = await TeamChat.findMany({
      where: { teamId: Number(teamId) },
      orderBy: { createdAt: "asc" },
      include: {
        user: true,
      },
    });
    const returnedData = teamChats.map((chat) => {
      return {
        id: chat.id,
        teamId: chat.teamId,
        userId: chat.userId,
        userName: chat.user.name,
        message: chat.message,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
    res.status(200).json(returnedData);
  } catch (error) {
    next(error);
  }
};
export const getUserChat: RequestHandler<
  unknown,
  unknown,
  unknown,
  UChat
> = async (req, res, next) => {
  try {
    const { senderId, receiverId } = req.query;

    if (!senderId || !receiverId) {
      throw createHttpError(400, "Sender ID and Receiver ID are required");
    }

    const userChats = await UserChat.findMany({
      where: {
        OR: [
          { senderId: Number(senderId), receiverId: Number(receiverId) },
          { senderId: Number(receiverId), receiverId: Number(senderId) },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
        receiver: true,
      },
    });
    const returnedData = userChats.map((chat) => {
      return {
        id: chat.id,
        senderId: chat.senderId,
        senderName: chat.sender.name,
        receiverId: chat.receiverId,
        receiverName: chat.receiver.name,
        message: chat.message,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });
    res.status(200).json(returnedData);
  } catch (error) {
    next(error);
  }
};

export const saveTeamMessage: RequestHandler<
  unknown,
  unknown,
  TChat,
  unknown
> = async (req, res, next) => {
  try {
    const { teamId, userId, message } = req.body;

    if (!teamId || !userId || !message) {
      throw createHttpError(400, "Team ID, User ID, and message are required");
    }

    const newMessage = await TeamChat.create({
      data: {
        teamId: Number(teamId),
        userId: Number(userId),
        message,
      },
    });


    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const saveUserMessage: RequestHandler<
  unknown,
  unknown,
  UChat,
  unknown
> = async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      throw createHttpError(
        400,
        "Sender ID, Receiver ID, and message are required"
      );
    }

    const newMessage = await UserChat.create({
      data: {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        message,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getAttachment: RequestHandler<
  AttachmentData,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw createHttpError(400, "Attachment ID is required");
    }

    const attachment = await Attachment.findUnique({
      where: { id: Number(id) },
    });

    if (!attachment) {
      throw createHttpError(404, "Attachment not found");
    }

    res.status(200).json(attachment);
  } catch (error) {
    next(error);
  }
};
export const getAttachments: RequestHandler = async (req, res, next) => {
  try {
    const { messageId, type } = req.query;

    if (!messageId) {
      throw createHttpError(400, "Message ID is required");
    }
    let attachments;
    if (type === "user") {
      attachments = await Attachment.findMany({
        where: { userChatId: Number(messageId) },
      });
    } else {
      attachments = await Attachment.findMany({
        where: { teamChatId: Number(messageId) },
      });
    }

    res.status(200).json(attachments);
  } catch (error) {
    next(error);
  }
};

export const saveAttachment: RequestHandler = async (req, res, next) => {
  try {
    const { messageId, fileName, filePath, type } = req.body;

    if (!messageId || !fileName || !filePath) {
      throw createHttpError(
        400,
        "Message ID, file name, and file path are required"
      );
    }
    let newAttachment;
    if (type === "user") {
      newAttachment = await await Attachment.create({
        data: {
          userChatId: Number(messageId),
          fileName,
          filePath,
        },
      });
    } else {
      newAttachment = await await Attachment.create({
        data: {
          teamChatId: Number(messageId),
          fileName,
          filePath,
        },
      });
    }

    res.status(201).json(newAttachment);
  } catch (error) {
    next(error);
  }
};
