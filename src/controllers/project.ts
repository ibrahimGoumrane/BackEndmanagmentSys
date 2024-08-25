/* eslint-disable @typescript-eslint/no-unused-vars */
import { ModuleType } from "@prisma/client";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import path from "path";
import { projectRoot } from "../app";
import emailSender from "../middleware/emailHandler/emailSender";
import {
  acceptanceRequestTeamEmail,
  emailRequestTeamTemplate,
  rejectionRequestTeamEmail,
} from "../middleware/emailTemplates/teamEmail";
import handleDeleteImg from "../middleware/ImgUploads/handleDeleteImg";
import { handleProjectUploads } from "../middleware/ImgUploads/handleUploadImg";
import {
  authorisation,
  Autorisation,
  autorisationModel,
  autorisationModelInputs,
  ExtendedQuery,
} from "../models/autorisation";
import {
  getProjectData,
  project,
  projectMemeberAssociation,
  ProjectModifDelete,
  ProjectSearch,
  ProjectUpdate,
  ResponseToJoin,
} from "../models/project";
import { Member, user } from "../models/user";
import task from "../models/task";

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

export const ProjectData: RequestHandler = async (req, res, next) => {
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
    const returnedData = {
      id: returnedProj.id,
      name: returnedProj.name,
      description: returnedProj.description,
      statusId: returnedProj.statusId,
      ManagerId: returnedProj.ManagerId,
      startDate: returnedProj.startDate.toISOString(),
      endDate: returnedProj.endDate?.toISOString() || "",
      createdAt: returnedProj.createdAt.toISOString(),
      updatedAt: returnedProj.updatedAt.toISOString(),
    };

    res.status(200).json(returnedData);
  } catch (error) {
    next(error);
  }
};
export const getProjectInfo: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const returnedProj = await project.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        Manager: true,
        status: true,
      },
    });
    if (!returnedProj) {
      throw createHttpError(404, "Project not found");
    }

    const returnedData: getProjectData = {
      id: returnedProj.id,
      name: returnedProj.name,
      description: returnedProj.description,
      startDate: returnedProj.startDate.toISOString(),
      endDate: returnedProj.endDate?.toISOString() || "",
      ManagerName: returnedProj.Manager.name,
      statusName: returnedProj.status?.name || "initiated",
      createdAt: returnedProj.createdAt.toISOString(),
      updatedAt: returnedProj.updatedAt.toISOString(),
    };

    res.status(200).json(returnedData);
  } catch (error) {
    next(error);
  }
};
export const getProjectImage: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const projectData = await project.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!projectData) {
      throw createHttpError(404, "Project not found");
    }
    const imageUrl = `/uploads/project/${path.basename(projectData.projectImage ?? "")}`;
    res.json(imageUrl);
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
export const getProjectAuth: RequestHandler<
  unknown,
  unknown,
  unknown,
  autorisationModelInputs
> = async (req, res, next) => {
  const { userId, moduleId } = req.query;
  try {
    const projectAuth = await Autorisation.findMany({
      where: {
        AND: [
          {
            moduleId: Number(moduleId),
            userId: Number(userId),
          },
          {
            OR: [
              {
                moduleType: ModuleType.PROJECT,
              },
              {
                moduleType: ModuleType.TASKMANAGER,
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        moduleId: true,
        moduleType: true,
        action: true,
        user: true,
      },
    });
    if (!projectAuth || projectAuth.length === 0) {
      const userObj = await user.findFirst({
        where: {
          id: Number(userId),
        },
      });
      if (!userObj) {
        throw createHttpError(404, "No user found");
      }
      const retunredData = {
        ...userObj,
        auth: [],
      };
      return res.status(200).json(retunredData);
    }
    const userObj = projectAuth[0].user;
    if (!userObj) {
      throw createHttpError(404, "No user found");
    }
    const auth: authorisation[] = projectAuth.map(({ user, ...au }) => {
      // Add your logic here
      return {
        id: au.id.toString(),
        moduleId: au.moduleId.toString(),
        moduleType: au.moduleType,
        action: au.action,
      };
    });
    const retunredData = {
      ...userObj,
      auth: auth,
    };
    res.status(200).json(retunredData);
  } catch (error) {
    next(error);
  }
};
export const requestToJoin: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  const { userId } = req.session;
  const { id } = req.params;
  try {
    const NewUser = await user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!NewUser) {
      throw createHttpError(401, "User not authenticated");
    }
    if (!id) {
      throw createHttpError(400, "Please provide the project Id");
    }
    const projectExist = await project.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        Manager: true,
      },
    });
    if (!projectExist) {
      throw createHttpError(404, "Project not found");
    }

    //Sending the email
    const mailData = {
      from: NewUser.email, // Who is sending the letter
      to: projectExist.Manager.email, // Who is receiving the letter
      subject: "Request TO Join YOur Project  : " + projectExist.name, // The title of the letter
      text: "That was easy!", // The simple message inside the letter
      html: emailRequestTeamTemplate(
        NewUser.id.toString(),
        id.toString(),
        NewUser.name,
        "project"
      ),
    };
    emailSender(mailData)
      .then(() => {
        res.status(200).json({ message: "Email sent successfully" });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const handleReponseRequestJoin: RequestHandler<
  unknown,
  unknown,
  unknown,
  ResponseToJoin
> = async (req, res, next) => {
  const { projectId, userId, status } = req.query;
  try {
    const NewUser = await user.findFirst({
      where: {
        id: +userId,
      },
    });
    if (!NewUser) {
      throw createHttpError(401, "User not authenticated");
    }
    const projectObj = await project.findFirst({
      where: {
        id: +projectId,
      },
    });
    if (!projectObj) {
      throw createHttpError(404, "Project not found");
    }
    let html;
    if (status === "ACCEPTED") {
      const projectLink = await projectMemeberAssociation.create({
        data: {
          userId: +userId,
          projectId: +projectId,
        },
      });
      if (!projectLink) {
        return setTimeout(() => {
          res
            .status(400)
            .send(
              `<h1>There was an error while trying to add the user to the team</h1>`
            );
        }, 1000);
      }
      html = acceptanceRequestTeamEmail(NewUser.name, "project");
    } else {
      html = rejectionRequestTeamEmail(NewUser.name, "project");
    }
    const mailData = {
      from: "goumrane.ibrahim@ensam-casa.ma", // Who is sending the letter
      to: NewUser?.email, // Who is receiving the letter
      subject:
        "Response of Your Request To Join the Project : " + projectObj?.name, // The title of the letter
      text: "That was easy!", // The simple message inside the letter
      html, // A fancy message inside the letter with bold text
    };
    emailSender(mailData)
      .then(() => {})
      .catch((error) => {
        next(error);
      });

    res.status(200).send(
      `
        <html>
          <head>
              <meta http-equiv="refresh" content="3;url=http://localhost:5173/home/" />
          </head>
          <body>
          <h1>Your response has been registered successfully. The user has been ${
            status === "ACCEPTED" ? "ACCEPTED" : "REJECTED"
          }</h1>
              <h1>Redirecting in 3 seconds...</h1>
          </body>
      </html>
`
    );
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
  ///working on profile image
  const uploadPath = "\\uploads\\project\\default.jpg";

  try {
    if (!name || !description) {
      throw createHttpError(400, "Please provide all the required fields");
    }

    //check if a project with the same name already exists
    const projectExist = await project.findFirst({
      where: {
        name,
      },
    });
    if (projectExist) {
      throw createHttpError(409, "A project with the same name already exists");
    }

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
        projectImage: uploadPath,
      },
    });
    if (!projectModal) {
      throw createHttpError(400, "Please provide all the required fields");
    }
    req.params.id = projectModal.id;
    next();
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
    const returnedProject = userProjects.map((project) => ({
      ...project.project,
      projectImage: `/uploads/project/${path.basename(project.project.projectImage ?? "")}`,
    }));
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

    if (projectExsist.name !== name) {
      const projectExist = await project.findMany({
        where: {
          name,
        },
      });
      if (projectExist.length > 0) {
        throw createHttpError(
          409,
          "A project with the same name already exists"
        );
      }
    }
    //check if there is a project with the same name
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
  unknown,
  unknown,
  autorisationModel[],
  ExtendedQuery
> = async (req, res, next) => {
  const { moduleId: id } = req.query;
  const NewMembers = req.body;

  try {
    // Find the project entity
    const projectEntity = await project.findFirst({
      where: { id: Number(id) },
    });

    if (!projectEntity) {
      throw createHttpError(404, "Project not found");
    }

    // Remove all existing project members and their authorizations
    await projectMemeberAssociation.deleteMany({
      where: {
        projectId: Number(id),
      },
    });
    await Autorisation.deleteMany({
      where: {
        moduleId: Number(id),
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

      // Prepare new authorization data and flatten the array
      const newAuthData = NewMembers.flatMap((member) =>
        member.auth.map((auth) => ({
          userId: +member.id,
          moduleId: +auth.moduleId,
          moduleType: auth.moduleType,
          action: auth.action,
        }))
      );

      if (newAuthData.length > 0) {
        await Autorisation.createMany({
          data: newAuthData,
        });
      }

      // Retrieve all updated permissions
      const updatedPermissions = await Autorisation.findMany({
        where: {
          moduleId: Number(id),
        },
      });

      // Group permissions by user and map them back to members
      const membersWithPermissions: autorisationModel[] = NewMembers.map(
        (member) => {
          const memberPermissions = updatedPermissions
            .filter((auth) => auth.userId === +member.id)
            .map((auth) => ({
              id: auth.id.toString(),
              moduleId: auth.moduleId.toString(),
              moduleType: auth.moduleType,
              action: auth.action,
            }));

          return {
            id: member.id,
            name: member.name,
            email: member.email,
            auth: memberPermissions,
          };
        }
      );

      res.status(200).json(membersWithPermissions);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    next(error);
  }
};
export const removeMember: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  ExtendedQuery
> = async (req, res, next) => {
  const { moduleId: id } = req.query;
  const { id: userId } = req.params;

  try {
    // Find the project entity
    const projectEntity = await project.findFirst({
      where: { id: Number(id) },
    });

    if (!projectEntity) {
      throw createHttpError(404, "Project not found");
    }
    if (!userId) {
      throw createHttpError(400, "Please provide the user Id");
    }

    // Remove project members and his authorizations
    await projectMemeberAssociation.deleteMany({
      where: {
        projectId: Number(id),
        userId: +userId,
      },
    });
    await Autorisation.deleteMany({
      where: {
        moduleId: Number(id),
        userId: +userId,
      },
    });

    //remove all tasks created by that user and set the one assigne to him to null
    await task.deleteMany({
      where: {
        creatorId: +userId,
        projectId: Number(id),
      },
    });
    await task.updateMany({
      where: {
        AssigneeId: +userId,
        projectId: Number(id),
      },
      data: {
        AssigneeId: null,
      },
    });
    //check if the project has no members
    const projectMembers = await projectMemeberAssociation.findMany({
      where: {
        projectId: Number(id),
      },
    });
    if (projectMembers.length === 0) {
      await project.delete({
        where: {
          id: Number(id),
        },
      });
    }
    res.status(200).json({
      message: "User removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updateProjectImage: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  ExtendedQuery
> = async (req, res, next) => {
  const { userId } = req.session;
  const { id } = req.params;

  try {
    if (!userId) {
      throw createHttpError(401, "Unauthenticated");
    }
    if (!id) {
      throw createHttpError(400, "Please provide the project Id");
    }
    const projectData = await project.findUnique({
      where: {
        id: +id,
      },
    });
    if (!projectData) {
      throw createHttpError(404, "User not found");
    }

    //handle Delete Previous Image
    if (
      projectData.projectImage &&
      projectData.projectImage !== "/uploads/project/default.jpg"
    ) {
      await handleDeleteImg(projectData.projectImage);
    }
    const uploadDirection = handleProjectUploads(req.files?.projectImg);
    if (!uploadDirection) {
      throw createHttpError(400, "Image upload failed");
    }
    await project.update({
      where: {
        id: +id,
      },
      data: {
        projectImage: uploadDirection,
      },
    });
    res.status(200).json(uploadDirection);
  } catch (error) {
    next(error);
  }
};

export const leaveProject: RequestHandler<
  ProjectModifDelete,
  unknown,
  unknown,
  ExtendedQuery
> = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.session;

  try {
    // Find the project entity
    const projectEntity = await project.findFirst({
      where: { id: Number(id) },
    });

    if (!projectEntity) {
      throw createHttpError(404, "Project not found");
    }

    const asso = await projectMemeberAssociation.findFirst({
      where: {
        projectId: Number(id),
        userId: userId,
      },
    });

    // Remove project members and his authorizations
    await projectMemeberAssociation.delete({
      where: {
        id: asso?.id,
      },
    });

    await Autorisation.deleteMany({
      where: {
        moduleId: Number(id),
        userId: userId,
      },
    });

    //check if the project has no members
    const projectMembers = await projectMemeberAssociation.findMany({
      where: {
        projectId: Number(id),
      },
    });
    if (projectMembers.length === 0) {
      await project.delete({
        where: {
          id: Number(id),
        },
      });
    }
    res.status(200).json({
      message: "You have left the project successfully",
    });
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
      include: {
        user: true,
      },
    });
    if (!projectUsers) {
      throw createHttpError(404, "No users found");
    }
    const users: Member[] = projectUsers.map(({ user: { id, ...data } }) => {
      return {
        ...data,
        id: id.toString(),
      };
    });
    const newMembers = await Promise.all(
      users.map(async (user) => {
        const auths = await Autorisation.findMany({
          where: {
            userId: +user.id,
            moduleId: +id,
          },
        });
        const inseertedAuth: authorisation[] = auths.map((auth) => {
          return {
            id: auth.id.toString(),
            moduleId: auth.moduleId.toString(),
            moduleType: auth.moduleType,
            action: auth.action,
          };
        });

        return {
          ...user,
          auth: inseertedAuth,
        };
      })
    );

    res.status(200).json(newMembers);
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
