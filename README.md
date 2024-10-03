#Members Only Club

This project is a member-only website built with Node.js, Express, PostgreSQL, and Passport.js. 
The site allows users to sign up, log in, create messages, and view messages posted by other users. 
However, default users will see message authors as anonymous, while only members can view the actual authors. 
Admin users have additional privileges, including the ability to delete any message.

##Features

**User Authentication:** Sign-up and log-in forms using Passport.js for user authentication with encrypted passwords (bcrypt).
**Membership Status:** Users can become members by entering a secret passcode, allowing them to view message authors.
**Message Posting:** Logged-in users can post messages with titles, timestamps, and text. All visitors can view messages, but only members see the author's name.
**Admin Privileges:** Admin users have the ability to delete any message.
**Validation & Security:** User input validation, password confirmation, and bcrypt password hashing.

##Technologies Used

**Node.js** and **Express.js:** Backend framework for building the server and routing.
**PostgreSQL:** Database used to store users and messages.
**Passport.js:** Authentication middleware for user login and session handling.
**EJS:** Templating engine for rendering dynamic pages.
**Bcrypt:** Used for hashing passwords before storing them in the database.

##Setup

1. Clone the repository.
2. Run ***npm install*** to install dependencies.
3. Configure your PostgreSQL database and environment variables.
4. Run database migrations to create the necessary tables.
5. Start the server with ***npm start***.
