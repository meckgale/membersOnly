const db = require("../config/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const alphaErr = "must only contain letters.";
const matchesErr =
  "must only contain letters or numbers. underscores, periods, or hyphens cannot be use consecutive, start or end of the username.";
const lengthErr = "must be between 2 and 30 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`Last name ${lengthErr}`),
  body("userName")
    .custom(async (value) => {
      const user = await db.findUserByUserName(value);
      if (user) {
        throw new Error("This username is taken, try a different user name");
      }
      return true;
    })
    .trim()
    .matches(/^(?!.*[._-]{2,})(?![._-])[a-zA-Z0-9._-]+(?<![._-])$/)
    .withMessage(`Username ${matchesErr}`)
    .isLength({ min: 2, max: 30 })
    .withMessage(`Username ${lengthErr}`),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

exports.signUp = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        title: "Sign Up",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, userName, password } = req.body;
    try {
      // Hash the password before storing it
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err); // Handle the error
        }
        // Store hashed password in the database
        await db.insertUser(firstName, lastName, userName, hashedPassword);
        res.redirect("/");
      });
    } catch (err) {
      return next(err);
    }
  },
];
