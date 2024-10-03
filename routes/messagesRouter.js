const { Router } = require("express");
const messagesController = require("../controllers/messagesController");
messagesRouter = Router();

messagesRouter.get("/new-message", messagesController.newMessageGet);
messagesRouter.post("/new-message", messagesController.newMessagePost);

messagesRouter.get("/messages", messagesController.getMessages);

messagesRouter.post("/messages/:id/delete", messagesController.deleteMessage);

module.exports = messagesRouter;
