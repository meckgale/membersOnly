const pool = require("./pool");

async function insertUser(firstName, lastName, userName, password) {
  await pool.query(
    "INSERT INTO users (first_name, last_name, user_name, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, userName, password]
  );
}

async function findUserByUserName(userName) {
  const result = await pool.query("SELECT * FROM users WHERE user_name = $1", [
    userName,
  ]);

  // Return the found user or null if not found
  return result.rows.length > 0 ? result.rows[0] : null;
}

module.exports = {
  insertUser,
  findUserByUserName,
};
