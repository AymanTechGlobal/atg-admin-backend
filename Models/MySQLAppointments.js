const db = require("../Config/mysqldb");

// Fetch all appointments with client and care navigator names
async function getAllAppointments(limit = 100) {
  const [rows] = await db.query(
    `SELECT 
      ca.appointment_id, 
      ca.client_username, 
      ca.appointment_date_time, 
      ca.status, 
      ca.client_note, 
      u_client.username AS client_name, 
      u_navigator.username AS care_navigator
    FROM client_appointments ca
    LEFT JOIN users u_client ON ca.client_username = u_client.username
    LEFT JOIN users u_navigator ON u_navigator.role = 1
    ORDER BY ca.appointment_date_time DESC
    LIMIT ?`,
    [limit]
  );
  return rows;
}

// Fetch a single appointment by ID
async function getAppointmentById(appointmentId) {
  const [rows] = await db.query(
    `SELECT 
      ca.appointment_id, 
      ca.client_username, 
      ca.appointment_date_time, 
      ca.status, 
      ca.client_note, 
      u_client.username AS client_name, 
      u_navigator.username AS care_navigator
    FROM client_appointments ca
    LEFT JOIN users u_client ON ca.client_username = u_client.username
    LEFT JOIN users u_navigator ON u_navigator.role = 1
    WHERE ca.appointment_id = ?
    LIMIT 1`,
    [appointmentId]
  );
  return rows[0];
}

// Update appointment status and note
async function updateAppointment(appointmentId, { status, notes }) {
  const [result] = await db.query(
    `UPDATE client_appointments SET status = ?, client_note = ? WHERE appointment_id = ?`,
    [status, notes, appointmentId]
  );
  return result;
}

// Delete appointment
async function deleteAppointment(appointmentId) {
  const [result] = await db.query(
    `DELETE FROM client_appointments WHERE appointment_id = ?`,
    [appointmentId]
  );
  return result;
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
