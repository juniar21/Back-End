import { NextFunction, Request, request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid Email Format"),
  body("password").notEmpty().withMessage("Password Required"),
  body("username").notEmpty().withMessage("Username Required"),
  body("fullname").notEmpty().withMessage("Fullname Required"),

  (req: Request, res:Response, next: NextFunction ) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({errors:errors.array() });
        return;
    }
    next()
  }
];
