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
    // Fetch and return the newly created task statuses
    const defaultValues: TaskStatus[] = await Taskstatus.findMany({
      where: {
        projectId: null,
      },
    });
    const returnedValues: TaskStatus[] = await Taskstatus.findMany({
      where: {
        projectId: +projectId,
      },
    });
    const returned = [];
    returned.push(...defaultValues);
    returned.push(...returnedValues);
    res.status(200).json(returned);
  } catch (error) {
    next(error);
  }
};

export const createTaskStatus: RequestHandler<
  unknown,
  unknown,
  statusCreation,
  unknown
> = async (req, res, next) => {
  const { name, projectId } = req.body;
  try {
    if (!name) {
      throw createHttpError(400, "Please provide all the required fields");
    }
    const newStatus = await Taskstatus.create({
      data: {
        name,
        projectId: +projectId,
      },
    });

    res.status(201).json(newStatus);
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus: RequestHandler<
  statusDeletion,
  unknown,
  TaskStatus[],
  unknown
> = async (req, res, next) => {
  const id = req.params.id;
  const tasks = req.body;
  try {
    if (!tasks || !Array.isArray(tasks)) {
      throw createHttpError(
        400,
        "Please provide a valid array of task statuses"
      );
    }
    const newTaskStatusData = tasks
      .filter((stat) => stat.projectId)
      .map((stat) => ({
        id: stat.id,
        name: stat.name,
        projectId: stat.projectId ? +stat.projectId : null,
      }));

    await Taskstatus.deleteMany({
      where: {
        projectId: +id,
      },
    });
    // Create new task statuses
    await Taskstatus.createMany({
      data: newTaskStatusData,
    });
    // Fetch and return the newly created task statuses
    const defaultValues: TaskStatus[] = await Taskstatus.findMany({
      where: {
        projectId: null,
      },
    });
    const returnedValues: TaskStatus[] = await Taskstatus.findMany({
      where: {
        projectId: +id,
      },
    });
    const returned = [];
    returned.push(...defaultValues);
    returned.push(...returnedValues);
    res.status(200).json(returned);
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
