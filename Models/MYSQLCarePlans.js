// ---------------------------------------------------------------------------
// This file is used to define the schema for the care plans
// uses RDS DB directly to fetch the data
// ---------------------------------------------------------------------------

const db = require("../Config/mysqldb");

async function getAllCarePlans(limit = 100) {
  const [rows] = await db.query(
    `SELECT 
        cp.id AS care_plan_id,
        COALESCE(cu.calendly_name, cu.username) AS patient_name,
        COALESCE(nu.calendly_name, nu.username) AS care_navigator,
        cp.date_created,
        cp.end_date,
        cp.status,
        cp.care_plan_name AS actions
     FROM care_plans cp
     JOIN users cu ON cp.client_username = cu.username AND cu.role = 0
     JOIN users nu ON cp.care_navigator_username = nu.username AND nu.role = 1
     ORDER BY cp.date_created DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
}

module.exports = {
  getAllCarePlans,
};
