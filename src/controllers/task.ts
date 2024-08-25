import { RequestHandler } from "express";
import task, { taskDeletion, taskModif } from "../models/task";
import createHttpError from "http-errors";
import { updateActivity } from "../middleware/activityMiddleware/createActivity";

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
        statusId: +statusId,
        projectId: +projectId,
        creatorId: +creatorId,
        description,
      },
    });
    res.locals.Task = CreatedTask;
    next();
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
    // New values from the request
    const { id, name, AssigneeId, StoryPoint, endDate, statusId, description } =
      req.body;

    const userId = req.session.userId;
    if (!userId) {
      return next(
        createHttpError(401, "You are not authorized to perform this action")
      );
    }

    const foundedTask = await task.findFirst({
      where: { id },
    });

    if (!foundedTask) {
      return next(createHttpError(404, "Task not found"));
    }

    const updatedData: Partial<taskModif> = {};
    const changes: Record<string, { oldValue: string; newValue: string }> = {};

    // Compare each property and track changes
    if (name && name !== foundedTask.name) {
      updatedData.name = name;
      changes.name = { oldValue: foundedTask.name, newValue: name };
    }
    if (AssigneeId && AssigneeId !== foundedTask.AssigneeId) {
      updatedData.AssigneeId = AssigneeId;
      changes.AssigneeId = {
        oldValue: foundedTask.AssigneeId?.toString() || "Unassigned",
        newValue: AssigneeId.toString() || "Unassigned",
      };
    }
    if (StoryPoint && StoryPoint !== foundedTask.StoryPoint) {
      updatedData.StoryPoint = StoryPoint;
      changes.StoryPoint = {
        oldValue: foundedTask.StoryPoint?.toString() || "no value",
        newValue: StoryPoint?.toString() || "no value ",
      };
    }
    if (
      endDate &&
      new Date(endDate).toISOString() !== foundedTask?.endDate?.toISOString()
    ) {
      updatedData.endDate = new Date(endDate).toISOString();
      changes.endDate = {
        oldValue: foundedTask.endDate?.toString() || "No date set",
        newValue: new Date(endDate).toISOString(),
      };
    }
    if (statusId && statusId !== foundedTask.statusId) {
      updatedData.statusId = statusId;
      changes.statusId = {
        oldValue: foundedTask.statusId?.toString() || "No status",
        newValue: statusId.toString(),
      };
    }

    if (description && description !== foundedTask.description) {
      updatedData.description = description;
      changes.description = {
        oldValue: foundedTask.description || "No description",
        newValue: description || "No description",
      };
    }

    // Update the task if there are any changes
    if (Object.keys(updatedData).length > 0) {
      const updatedTask = await task.update({
        where: { id },
        data: {
          ...updatedData,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });

      // Register the changes as an activity
      for (const [key, value] of Object.entries(changes)) {
        if (!value.oldValue || !value.newValue) {
          return res.status(400).json({
            error: `Old and new values are required for ${key}.`,
          });
        }
        await updateActivity(
          userId,
          updatedTask.projectId,
          id,
          key,
          value.oldValue,
          value.newValue,
          next
        );
      }

      return res.status(200).json(updatedTask);
    }

    return res.status(200).json(foundedTask); // No changes, return original task
  } catch (error) {
    return next(error);
  }
};

export const deleteProjectTask: RequestHandler<
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
// Delete a task

export const deleteTask: RequestHandler<
  taskDeletion,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const FoundedTask = await task.findFirst({
      where: {
        id: +id,
      },
    });
    if (!FoundedTask)
      createHttpError(404, "There is not task with this id  : " + id);
    await task.delete({
      where: {
        id: +id,
      },
    });
    console.log(FoundedTask);
    res.locals.Task = FoundedTask;
    next();
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
