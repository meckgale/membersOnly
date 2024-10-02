const { Router } = require("express");
const indexRouter = Router();
const usersRouter = require("./usersRouter");

indexRouter.get("/", (req, res) => {
  console.log("Current User:", req.user);
  console.log("Session data:", req.session);
  res.render("index", { title: "Home" });
});

indexRouter.use("/", usersRouter);

module.exports = indexRouter;
