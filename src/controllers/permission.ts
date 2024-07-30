// import { RequestHandler } from "express";
// import {
//   permission,
//   PermissionCreation,
//   PermissionModifDelete,
// } from "../models/permission";

// import createHttpError from "http-errors";

// export const getPermission: RequestHandler<
//   PermissionModifDelete,
//   unknown,
//   unknown,
//   unknown
// > = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const permissionModel = await permission.findFirst({
//       where: {
//         id: Number(id),
//       },
//     });
//     if (!permissionModel) {
//       throw createHttpError(404, "Permission not found");
//     }
//     res.status(200).json(permissionModel);
//   } catch (error) {
//     next(error);
//   }
// };
// export const addPermission: RequestHandler<
//   unknown,
//   unknown,
//   PermissionCreation,
//   unknown
// > = async (req, res, next) => {
//   const { name } = req.body;
//   try {
//     const newPermission = await permission.create({
//       data: {
//         value: name,
//       },
//     });
//     res.status(201).json(newPermission);
//   } catch (error) {
//     next(error);
//   }
// };
// export const updatePermission: RequestHandler<
//   PermissionModifDelete,
//   unknown,
//   PermissionCreation,
//   unknown
// > = async (req, res, next) => {
//   const { id } = req.params;
//   const { name } = req.body;
//   try {
//     const updatedPermission = await permission.update({
//       where: {
//         id: Number(id),
//       },
//       data: {
//         value: name,
//       },
//     });
//     if (!updatePermission) {
//       throw createHttpError(404, "Permission not found");
//     }
//     res.status(200).json(updatedPermission);
//   } catch (error) {
//     next(error);
//   }
// };
// export const deletePermission: RequestHandler<
//   PermissionModifDelete,
//   unknown,
//   unknown,
//   unknown
// > = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const deletedPermission = await permission.delete({
//       where: {
//         id: Number(id),
//       },
//     });
//     if (!deletedPermission) {
//       throw createHttpError(404, "Permission not found");
//     }
//     res.status(200).json(deletedPermission);
//   } catch (error) {
//     next(error);
//   }
// };
