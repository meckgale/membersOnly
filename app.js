require("dotenv").config();
const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set currentUser in res.locals for access in all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user; // Set the current user if logged in
  next();
});

app.use("/", indexRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
