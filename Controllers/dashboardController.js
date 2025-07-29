// ---------------------------------------------------------------------------
// This file is used to define the controller for the dashboard
// uses RDS DB directly to fetch the data no
// not using models for this file
// ---------------------------------------------------------------------------

const db = require("../Config/mysqldb");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total patients
    const [[{ totalPatients }]] = await db.query(
      "SELECT COUNT(*) as totalPatients FROM users WHERE role = 0"
    );
    // Total care navigators
    const [[{ totalCareNavigators }]] = await db.query(
      "SELECT COUNT(*) as totalCareNavigators FROM users WHERE role = 1"
    );
    // Total care plans
    const [[{ totalCarePlans }]] = await db.query(
      "SELECT COUNT(*) as totalCarePlans FROM care_plans"
    );
    // Total appointments
    const [[{ totalAppointments }]] = await db.query(
      "SELECT COUNT(*) as totalAppointments FROM client_appointments"
    );
    // New patients this month
    const [[{ newThisMonth }]] = await db.query(
      `SELECT COUNT(*) as newThisMonth FROM users WHERE role = 0 AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
    );
    // Active/inactive patients
    const [[{ activePatients }]] = await db.query(
      "SELECT COUNT(*) as activePatients FROM users WHERE role = 0 AND status = 2"
    );
    const [[{ inactivePatients }]] = await db.query(
      "SELECT COUNT(*) as inactivePatients FROM users WHERE role = 0 AND status = 0 || status = 1"
    );
    // Most common allergies
    const [mostCommonAllergies] = await db.query(
      `SELECT known_allergies as allergy, COUNT(*) as count FROM client_details WHERE known_allergies IS NOT NULL AND known_allergies != '' GROUP BY known_allergies ORDER BY count DESC LIMIT 5`
    );
    // Recent registrations
    const [recentRegistrations] = await db.query(
      `SELECT username as userId, created_at as registeredAt FROM users WHERE role = 0 ORDER BY created_at DESC LIMIT 5`
    );
    // Appointments by status
    const [appointmentsByStatus] = await db.query(
      `SELECT status, COUNT(*) as count FROM client_appointments GROUP BY status`
    );
    // Care plans by status
    const [carePlansByStatus] = await db.query(
      `SELECT status, COUNT(*) as count FROM care_plans GROUP BY status`
    );

    res.json({
      totalPatients,
      totalCareNavigators,
      totalCarePlans,
      totalAppointments,
      newThisMonth,
      activePatients,
      inactivePatients,
      mostCommonAllergies,
      recentRegistrations,
      appointmentsByStatus,
      carePlansByStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
