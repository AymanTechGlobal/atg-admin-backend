const db = require("../Config/mysqldb");

async function createCareNavigator(username, email, calendlyName) {
  const sql = `
    INSERT INTO users (username, email, role, status, calendly_name)
    VALUES (?, ?, 1, 3, ?)
  `;

  try {
    await db.query(sql, [username, email, calendlyName]);
    return { success: true };
  } catch (error) {
    console.error("Error adding care navigator:", error);
    return { success: false, error };
  }
}

module.exports = {
  createCareNavigator,
};
