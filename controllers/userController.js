const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const matchesErr = "must only contain letters and some other stuff.";
const lengthErr = "must be between 1 and 30 characters.";

const validatePlayer = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`Last name ${lengthErr}`),
  body("userName")
    .trim()
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage(`Username ${matchesErr}`)
    .isLength({ min: 1, max: 30 })
    .withMessage(`Username ${lengthErr}`),
];
