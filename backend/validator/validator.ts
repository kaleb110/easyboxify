import { body } from "express-validator";

export const addProductValidator = [
  body("name").trim().escape().notEmpty().withMessage("Name is required"),
  body("age").trim().escape().notEmpty().withMessage("Age is required"),
  body("email").trim().escape().notEmpty().withMessage("Image is required")
];