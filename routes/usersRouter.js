const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/signup", (req, res) =>
  res.render("signup", { title: "Sign Up" })
);
usersRouter.post("/signup", usersController.signUp);

module.exports = usersRouter;
