import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { activity } from "../models/activity";
import {
  ProjectModifDelete,
  ProjectSearch,
  ProjectUpdate,
  project,
  projectMemeberAssociation,
} from "../models/project";
import { User, user } from "../models/user";

export const getProjects: RequestHandler<
  unknown,
  unknown,
  unknown,
  ProjectSearch
> = async (req, res, next) => {
  const { search } = req.query;
  try {
    const projects = await project.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    if (!projects) {
      throw createHttpError(404, "No projects found");
    }
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProject: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const returnedProj = await project.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!returnedProj) {
      throw createHttpError(404, "Project not found");
    }
    res.status(200).json(returnedProj);
  } catch (error) {
    next(error);
  }
};

export const createProject: RequestHandler<
  ProjectModifDelete,
  unknown,
  ProjectUpdate,
  unknown
> = async (req, res, next) => {
  const { name, description } = req.body;
  const ManagerId = req.session.userId;
  if (!ManagerId) {
    throw createHttpError(401, "User not authenticated");
  }
  try {
    const projectModal = await project.create({
      data: {
        name: name || "",
        description: description || "",
        startDate: new Date(),
        ManagerId,
        statusId: 1,
        ProjectMemberAssociation: {
          create: {
            userId: ManagerId,
          },
        },
      },
    });
    if (!projectModal) {
      throw createHttpError(400, "Please provide all the required fields");
    }
    res.status(200).json(projectModal);
  } catch (error) {
    next(error);
  }
};

export const getUserProjects: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;

  try {
    const userProjects = await projectMemeberAssociation.findMany({
      where: {
        userId,
      },
      select: {
        project: true,
      },
    });
    const returnedProject = userProjects.map((project) => project.project);
    if (!returnedProject) {
      throw createHttpError(404, "No projects found");
    }
    res.status(200).json(returnedProject);
  } catch (error) {
    next(error);
  }
};
export const updateProject: RequestHandler<
  ProjectModifDelete,
  unknown,
  ProjectUpdate,
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    estimatedDuration,
    startDate,
    endDate,
    ManagerId,
    statusId,
  } = req.body;
  const { userId } = req.session;
  const updateData: { [key: string]: unknown } = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (estimatedDuration !== undefined)
    updateData.estimatedDuration = estimatedDuration;
  if (startDate !== undefined) updateData.startDate = new Date(startDate);
  if (endDate !== undefined) updateData.endDate = new Date(endDate);
  if (ManagerId !== undefined) updateData.ManagerId = ManagerId;
  if (statusId !== undefined) updateData.statusId = statusId;

  try {
    if (!userId) {
      throw createHttpError(401, "User not authenticated");
    }

    const projectExsist = await project.findUnique({
      where: { id: Number(id) },
    });
    if (!projectExsist) {
      return next();
    }
    const projectModf = await project.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(projectModf);
  } catch (error) {
    next(error);
  }
};

export const updateProjectMembers: RequestHandler<
  ProjectModifDelete,
  unknown,
  User[],
  unknown
> = async (req, res, next) => {
  const { id } = req.params;
  const NewMembers = req.body;

  try {
    // Find the project entity
    const projectEntity = await project.findFirst({
      where: { id: Number(id) },
    });

    if (!projectEntity) {
      throw createHttpError(404, "Project not found");
    }

    // Remove all existing project members
    await projectMemeberAssociation.deleteMany({
      where: {
        projectId: Number(id),
      },
    });

    // Add new members to the project
    const membersToAdd = NewMembers.map((member) => ({
      projectId: Number(id),
      userId: +member.id,
    }));

    if (membersToAdd.length > 0) {
      await projectMemeberAssociation.createMany({
        data: membersToAdd,
      });
    }

    res.status(200).json({ message: "Members updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const deleteProject: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const projectExist = await project.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!projectExist) {
      throw createHttpError(404, "Project not found");
    }
    const projectDel = await project.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(projectDel);
  } catch (error) {
    next(error);
  }
};
export const getProjectMembers: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectUsers = await projectMemeberAssociation.findMany({
      where: {
        projectId: Number(id),
      },
    });
    if (!projectUsers) {
      throw createHttpError(404, "No users found");
    }
    const users = await user.findMany({
      where: {
        id: {
          in: projectUsers.map((user) => user.userId),
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
export const getProjectStatus: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectData = await project.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        status: true,
      },
    });
    if (!projectData) {
      throw createHttpError(404, "No project Found with this Id");
    }
    const status = projectData.status;
    if (!status) {
      throw createHttpError(404, "No status found");
    }
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

export const getProjectTasks: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectTasks = await project.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        tasks: true,
      },
    });
    if (!projectTasks) {
      throw createHttpError(404, "No tasks found");
    }
    res.status(200).json(projectTasks);
  } catch (error) {
    next(error);
  }
};
export const getProjectActivity: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectTasks = await project.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        tasks: true,
      },
    });
    if (!projectTasks) {
      throw createHttpError(404, "No tasks found");
    }
    const projectActivity = await activity.findMany({
      where: {
        taskId: {
          in: projectTasks.tasks.map((task) => task.id),
        },
      },
      include: {
        user: true,
        task: true,
      },
    });
    res.status(200).json(projectActivity);
  } catch (error) {
    next(error);
  }
};
