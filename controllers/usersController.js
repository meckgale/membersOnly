require("dotenv").config();
const db = require("../config/queries");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

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

        // Retrieve the user after insertion
        const newUser = await db.findUserByUserName(userName);

        // Automatically log in the user after signup
        req.logIn(newUser, (err) => {
          if (err) {
            return next(err); // Handle error in logging in
          }
          return res.redirect("/"); // Redirect to home after login
        });
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.becomeMember = async (req, res) => {
  const { codeMember } = req.body;
  const userId = req.user.id;

  const INVITE_CODE = process.env.INVITE_CODE;

  if (codeMember === INVITE_CODE) {
    try {
      await db.addMember(userId);
      return res.redirect("/");
    } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
    }
  } else {
    res.status(400).send("Invalid code");
  }
};

exports.becomeAdmin = async (req, res) => {
  const { codeAdmin } = req.body;
  const userId = req.user.id;

  const ADMIN_CODE = process.env.ADMIN_CODE;

  if (codeAdmin === ADMIN_CODE) {
    try {
      await db.addAdmin(userId);
      return res.redirect("/"); // redirect to the homepage or admin panel
    } catch (error) {
      console.error(error);
      res.status(500).send("Database error");
    }
  } else {
    res.status(400).send("Invalid code");
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log("Error:", err);
      return next(err);
    }
    if (!user) {
      console.log("Login failed:", info.message);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error:", err);
        return next(err);
      }
      console.log("Login successful!");
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
