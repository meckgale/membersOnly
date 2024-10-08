const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/signup", (req, res) =>
  res.render("signup", { title: "Sign Up" })
);
usersRouter.post("/signup", usersController.signUp);

usersRouter.get("/become-member", (req, res) => res.render("become-member"));
usersRouter.post("/become-member", usersController.becomeMember);

usersRouter.get("/become-admin", (req, res) => res.render("become-admin"));
usersRouter.post("/become-admin", usersController.becomeAdmin);

usersRouter.get("/login", (req, res) => res.render("login"));
usersRouter.post("/login", usersController.login);

usersRouter.get("/logout", usersController.logout);

module.exports = usersRouter;
