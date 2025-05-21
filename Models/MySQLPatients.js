const db = require("../Config/mysqldb");

async function getAllPatients(limit = 100) {
  const [rows] = await db.query(
    `SELECT cd.*, cd.client_username AS patient_name, u.created_at
     FROM client_details cd
     JOIN users u ON cd.client_username = u.username
     WHERE u.role = 0
     ORDER BY u.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

module.exports = {
  getAllPatients,
};
