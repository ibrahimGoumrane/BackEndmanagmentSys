import { body } from "express-validator";

// Validator for creating a project
export const validateCreateProject = [
  body("name").notEmpty().withMessage("Project name is required"),
  body("description")
    .notEmpty()
    .isString()
    .withMessage("Description must be a string"),
];

export const validateTask = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 191 })
    .withMessage("Name must not exceed 191 characters"),
  body("statusId")
    .optional()
    .isInt()
    .withMessage("Status ID must be an integer"),
  body("projectId").optional(),
  body("AssigneId")
    .optional()
    .isInt()
    .withMessage("Assignee ID must be an integer"),
  body("StoryPoint")
    .optional({ nullable: true })
    .custom((value) => {
      if (
        value === null ||
        (Number.isInteger(value) && value.toString().length <= 4)
      ) {
        return true;
      }
      throw new Error(
        "StoryPoint must be an integer and not exceed 4 characters"
      );
    }),
  body("endDate")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || typeof value === "string") {
        return true;
      }
      throw new Error("Invalid endDate format");
    }),
  body("label")
    .optional()
    .isLength({ max: 191 })
    .withMessage("Label must not exceed 191 characters"),
  body("startDate")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || typeof value === "string") {
        return true;
      }
      throw new Error("Invalid startDate format");
    }),
  body("parentId")
    .optional()
    .isInt()
    .withMessage("Parent ID must be an integer"),
];

export const status = [
  body("name").notEmpty().withMessage("Status must have a name"),
];

export const permission = [
  body("name").notEmpty().withMessage("Set the permission name"),
];

export const comment = [
  body("content").notEmpty().withMessage("Comment must have content"),
  body("taskId")
    .notEmpty()
    .withMessage("Task ID is required")
    .isInt()
    .withMessage("Task ID must be an integer"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User Id must be an integer"),
];

export const activity = [
  body("description")
    .notEmpty()
    .withMessage("Activity must have a description"),
  body("taskId")
    .notEmpty()
    .withMessage("Task ID is required")
    .isInt()
    .withMessage("Task ID must be an integer"),
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User Id must be an integer"),
];

export const team = [
  body("name").notEmpty().withMessage("Team must have a name"),
];
