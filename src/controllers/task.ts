import { RequestHandler } from "express";
import task, { taskDeletion, taskModif } from "../models/task";
import createHttpError from "http-errors";

// Get all tasks based User
export const getAllUserAssignedTask: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { userId } = req.session;
    const tasks = await task.findMany({
      where: {
        AssigneeId: userId,
      },
    });
    if (!tasks) createHttpError(404, "No task found for User " + userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
export const getAllUserCreatedTask: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.session;
    const tasks = await task.findMany({
      where: {
        creatorId: userId,
      },
    });
    if (!tasks) createHttpError(404, "No task found for User " + userId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// Get all tasks based Project
export const getProjectTasks: RequestHandler = async (req, res, next) => {
  const { projectId } = req.params;

  try {
    const tasks = await task.findMany({
      where: {
        projectId: +projectId,
      },
      orderBy: {
        id: "asc",
      },
    });
    if (!tasks) createHttpError(404, "No task found for Project " + projectId);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};
//Get task
export const getTask: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const FoundedTask = await task.findFirst({
      where: {
        id: +id,
      },
      include: {
        creator: true,
        assignee: true,
        status: true,
        project: true,
      },
    });
    const returnedData = {
      id: FoundedTask?.id,
      name: FoundedTask?.name,
      description: FoundedTask?.description,
      storyPoint: FoundedTask?.StoryPoint,
      endDate: FoundedTask?.endDate,
      startDate: FoundedTask?.startDate,
      createdAt: FoundedTask?.createdAt,
      updatedAt: FoundedTask?.updatedAt,
      creatorName: FoundedTask?.creator?.name,
      AssigneName: FoundedTask?.assignee?.name,
      statusName: FoundedTask?.status?.name,
      projectName: FoundedTask?.project?.name,
    };

    if (!FoundedTask) createHttpError(404, "No task found with this Id " + id);

    res.status(200).json(returnedData);
  } catch (error) {
    next(error);
  }
};
//create a task
export const createTask: RequestHandler<
  unknown,
  unknown,
  taskModif,
  unknown
> = async (req, res, next) => {
  try {
    const { name, projectId, statusId, description } = req.body;
    const creatorId = req.session.userId;

    if (creatorId === undefined) {
      return next(
        createHttpError(401, "You are not authorized to perform this action")
      );
    }
    const CreatedTask = await task.create({
      data: {
        name,
        statusId,
        projectId,
        creatorId,
        description,
      },
    });

    res.status(201).json(CreatedTask);
  } catch (error) {
    next(error);
  }
};

// Update a task
export const updateTask: RequestHandler<
  unknown,
  unknown,
  taskModif,
  unknown
> = async (req, res, next) => {
  try {
    const {
      id,
      name,
      AssigneeId,
      StoryPoint,
      endDate,
      label,
      parentId,
      projectId,
      statusId,
      description,
    } = req.body;
    const creatorId = req.session.userId;
    if (creatorId === undefined) {
      return next(
        createHttpError(401, "You are not authorized to perform this action")
      );
    }

    const FoundedTask = await task.findFirst({
      where: {
        id,
      },
    });
    if (!FoundedTask) {
      return next();
    }

    const updatedData: Partial<taskModif> = {};
    if (name) updatedData.name = name;
    if (AssigneeId) updatedData.AssigneeId = AssigneeId;
    if (StoryPoint) updatedData.StoryPoint = StoryPoint;
    if (label) updatedData.label = label;
    if (parentId) updatedData.parentId = parentId;
    if (statusId) updatedData.statusId = statusId;
    if (projectId) updatedData.projectId = projectId;
    if (description) updatedData.description = description;
    const UpdatedTask = await task.update({
      where: {
        id,
      },
      data: {
        ...updatedData,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });
    console.log(UpdatedTask);

    return res.status(200).json(UpdatedTask);
  } catch (error) {
    return next(error);
  }
};

// Delete a task
export const deleteTask: RequestHandler<
  taskDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const FoundedTask = await task.findMany({
      where: {
        projectId: +id,
      },
    });
    if (!FoundedTask)
      createHttpError(
        404,
        "There is not task in this project to delete  : " + id
      );
    await task.deleteMany({
      where: {
        projectId: +id,
      },
    });
    res
      .status(200)
      .json({ message: "Task deleted successfully", FoundedTask: FoundedTask });
  } catch (error) {
    next(error);
  }
};
export const deleteUserTasks: RequestHandler<
  taskDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      createHttpError(401, "You are not authorized to perform this action");
      return;
    }
    const FoundedTask = await task.findMany({
      where: {
        OR: [{ creatorId: +userId }, { AssigneeId: +userId }],
      },
    });
    if (!FoundedTask)
      createHttpError(404, "There is not task For this user  : " + userId);
    await task.deleteMany({
      where: {
        OR: [{ creatorId: +userId }, { AssigneeId: +userId }],
      },
    });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
