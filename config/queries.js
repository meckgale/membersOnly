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

async function findUserByUserId(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function addMember(userId) {
  await pool.query("UPDATE users SET member = true WHERE id = $1", [userId]);
}

async function addAdmin(userId) {
  await pool.query("UPDATE users SET admin = true WHERE id = $1", [userId]);
}

async function newMessage(userId, message, createdAt) {
  await pool.query(
    "INSERT INTO messages (user_id, message, created_at) VALUES ($1, $2, $3)",
    [userId, message, createdAt]
  );
}

async function getMessages() {
  const result = await pool.query(`
    SELECT messages.id, messages.message, messages.created_at, users.user_name 
    FROM messages 
    JOIN users ON messages.user_id = users.id 
    ORDER BY messages.created_at DESC
  `);
  return result.rows;
}

async function deleteMessage(messageId) {
  await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);
}

module.exports = {
  insertUser,
  findUserByUserName,
  findUserByUserId,
  addMember,
  addAdmin,
  newMessage,
  getMessages,
  deleteMessage,
};
