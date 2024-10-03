const { Router } = require("express");
const indexRouter = Router();
const usersRouter = require("./usersRouter");
const messagesRouter = require("./messagesRouter");

indexRouter.get("/", (req, res) => {
  console.log("Current User:", req.user);
  console.log("Session data:", req.session);
  res.render("index", { title: "Home" });
});

indexRouter.use("/", usersRouter);
indexRouter.use("/", messagesRouter);

module.exports = indexRouter;
