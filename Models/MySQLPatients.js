const db = require("../Config/mysqldb");

async function getAllPatients(limit = 100) {
  const [rows] = await db.query(
    `SELECT * FROM care_intake ORDER BY date_of_birth DESC LIMIT ?`,
    [limit]
  );
  return rows;
}

module.exports = {
  getAllPatients,
};
