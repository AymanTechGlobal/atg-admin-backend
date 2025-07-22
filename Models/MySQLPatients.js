// ---------------------------------------------------------------------------
// This file is used to define the schema for the patients
// uses RDS DB directly to fetch the data
// ---------------------------------------------------------------------------

const db = require("../Config/mysqldb");

async function getAllPatients(limit = 100) {
  const [rows] = await db.query(
    `SELECT
      u.username AS userId,
      cd.calendly_name AS fullName,
      cd.date_of_birth AS dateOfBirth,
      cd.gender,
      cd.contact_number AS contactNumber,
      cd.known_allergies AS allergies,
      u.created_at AS submittedAt
    FROM users u
    LEFT JOIN client_details cd ON u.username = cd.client_username
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
