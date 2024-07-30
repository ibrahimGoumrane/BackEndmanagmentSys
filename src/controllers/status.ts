import { RequestHandler } from "express";
import {
  Projectstatus,
  Taskstatus,
  statusDeletion,
  statusCreation,
  TaskStatus,
} from "../models/status";
import createHttpError from "http-errors";
export const getAllProjectStatus: RequestHandler = async (req, res, next) => {
  try {
    const statusObs = await Projectstatus.findMany();
    if (!statusObs) {
      throw createHttpError(404, "No Project Status found");
    }
    res.status(200).json(statusObs);
  } catch (error) {
    next(error);
  }
};

export const getTaskStatusByProjectID: RequestHandler = async (
  req,
  res,
  next
) => {
  const { projectId } = req.params;

  try {
    const statusObs = await Taskstatus.findMany({
      where: {
        OR: [{ projectId: null }, { projectId: Number(projectId) }],
      },
    });

    if (statusObs.length === 0) {
      throw createHttpError(404, "No Task Status found");
    }

    res.status(200).json(statusObs);
  } catch (error) {
    next(error);
  }
};

export const createTaskStatus: RequestHandler<
  unknown,
  unknown,
  statusCreation,
  unknown
> = (req, res, next) => {
  const { name } = req.body;

  try {
    if (!name) {
      throw createHttpError(400, "Please provide all the required fields");
    }
    const newStatus = Taskstatus.create({
      data: {
        name,
      },
    });
    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};
export const updateTaskStatus: RequestHandler<
  unknown,
  unknown,
  TaskStatus[],
  unknown
> = async (req, res, next) => {
  const tasks = req.body;
  try {
    if (!tasks || !Array.isArray(tasks)) {
      throw createHttpError(
        400,
        "Please provide a valid array of task statuses"
      );
    }
    console.log(tasks);
    const newTaskStatusData = tasks
      .filter((task) => task.projectId)
      .map((task) => ({
        id: task.id,
        name: task.name,
        projectId: task.projectId ? +task.projectId : null,
      }));

    // Find existing task statuses
    const taskStatusIds = newTaskStatusData.map((task) => task.id);
    const existingTaskStatuses = await Taskstatus.findMany({
      where: {
        id: { in: taskStatusIds },
      },
    });

    const existingTaskStatusIds = new Set(
      existingTaskStatuses.map((status) => status.id)
    );
    const toUpdate = newTaskStatusData.filter((task) =>
      existingTaskStatusIds.has(task.id)
    );
    const toCreate = newTaskStatusData.filter(
      (task) => !existingTaskStatusIds.has(task.id)
    );
    console.log(toCreate);
    console.log(toUpdate);
    // Update existing task statuses
    for (const task of toUpdate) {
      await Taskstatus.update({
        where: { id: task.id },
        data: {
          name: task.name,
          projectId: task.projectId,
        },
      });
    }

    // Create new task statuses
    if (toCreate.length > 0) {
      await Taskstatus.createMany({
        data: toCreate,
      });
    }

    res
      .status(200)
      .json({ updated: toUpdate.length, created: toCreate.length });
  } catch (error) {
    next(error);
  }
};
export const deleteTaskStatus: RequestHandler<
  statusDeletion,
  unknown,
  unknown,
  unknown
> = (req, res, next) => {
  const { id } = req.params;
  try {
    const statusExsist = Taskstatus.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!statusExsist) {
      throw createHttpError(404, "Status not found");
    }
    const deletedStatus = Taskstatus.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletedStatus);
  } catch (error) {
    next(error);
  }
};
