const pool = require("./pool");

async function selectUserByUserName(userName) {
  const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [
    userName,
  ]);
  return user.rows.length > 0 ? user.rows[0] : null;
}

async function selectUserByUserId(id) {
  const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return user.rows.length > 0 ? user.rows[0] : null;
}

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

async function addMember(userId) {
  await pool.query("UPDATE users SET member = true WHERE id = $1", [userId]);
}

module.exports = {
  selectUserByUserName,
  selectUserByUserId,
  insertUser,
  findUserByUserName,
  addMember,
};
