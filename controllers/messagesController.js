require("dotenv").config();
const db = require("../config/queries");

exports.newMessageGet = async (req, res) =>
  res.render("new-message", { title: "New Message" });

exports.newMessagePost = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { message } = req.body;
  const createdAt = new Date();
  if (!userId || !message) {
    return res.status(400).send("User and message are required.");
  }
  try {
    await db.newMessage(userId, message, createdAt);
    res.redirect("/messages");
  } catch (error) {
    res.status(500).send("Error posting the message");
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await db.getMessages();
    res.render("messages", {
      title: "Messages",
      messages,
      currentUser: req.user,
    }); // Pass messages to the view
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving messages");
  }
};

exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;

  if (req.user && req.user.admin) {
    try {
      await db.deleteMessage(messageId);
      res.redirect("/messages");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error deleting message");
    }
  } else {
    res.status(403).send("Unauthorized");
  }
};
