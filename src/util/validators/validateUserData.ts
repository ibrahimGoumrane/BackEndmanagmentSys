import { body } from "express-validator";

export const validateSignUp = [
  body("name").trim().isString().notEmpty().withMessage("Name is required"),
  body("email").trim().isEmail().notEmpty().withMessage("Email is required"),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("age").trim().isNumeric().notEmpty().withMessage("Age is required"),
  body("skills").trim().isArray().optional(),
];
export const validateLogin = [
  body("name").trim().isString().notEmpty().withMessage("name is required"),
  body("password")
    .trim()
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
