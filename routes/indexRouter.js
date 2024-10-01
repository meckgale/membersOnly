const { Router } = require("express");
const indexRouter = Router();
const usersRouter = require("./usersRouter");

indexRouter.get("/", (req, res) => res.render("index"));

indexRouter.use("/", usersRouter);

module.exports = indexRouter;
