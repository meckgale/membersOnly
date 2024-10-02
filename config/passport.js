const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("./queries");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Finding user by username...");
      const user = await db.selectUserByUserName(username);

      if (!user) {
        console.log("Incorrect username");
        return done(null, false, { message: "Incorrect username" });
      }
      console.log("Checking password...");
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("Login successful!");
      return done(null, user);
    } catch (err) {
      console.log("Error during login:", err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log("Serializing user:", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user with ID:", id);
    const user = await db.selectUserByUserId(id); // Fetching the user by ID from the database
    if (!user) {
      console.log("User not found during deserialization");
    } else {
      console.log("User found during deserialization:", user);
    }
    done(null, user); // Passing the user to the next step
  } catch (err) {
    console.error("Error in deserializing user:", err);
    done(err);
  }
});

module.exports = passport;
