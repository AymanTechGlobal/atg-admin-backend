const AppointmentModel = require("../Models/MySQLAppointments");

// Helper to map MySQL row to frontend format
function mapAppointment(row) {
  return {
    appointmentId: row.appointment_id,
    patientName: row.client_username,
    status: row.status,
    appointmentDate: row.appointment_date_time
      ? new Date(row.appointment_date_time).toISOString().split("T")[0]
      : "",
    appointmentTime: row.appointment_date_time
      ? new Date(row.appointment_date_time).toISOString()
      : "",
  };
}

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointmentsSQL = await AppointmentModel.getAllAppointments();
    const simpleAppointments = appointmentsSQL.map(mapAppointment);
    res.status(200).json({
      success: true,
      data: simpleAppointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.getAppointmentById(
      req.params.id
    );
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: mapAppointment(appointment),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointment",
      error: error.message,
    });
  }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointmentId = req.params.id;
    const result = await AppointmentModel.updateAppointment(appointmentId, {
      status,
      notes,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    // Return the updated appointment
    const updated = await AppointmentModel.getAppointmentById(appointmentId);
    res.status(200).json({
      success: true,
      data: mapAppointment(updated),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const result = await AppointmentModel.deleteAppointment(appointmentId);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};

// Get sync status (optional, can be based on latest updated appointment)
exports.getSyncStatus = async (req, res) => {
  try {
    const appointments = await AppointmentModel.getAllAppointments(1);
    const lastSync =
      appointments.length > 0 ? appointments[0].appointment_date_time : null;
    res.status(200).json({
      success: true,
      data: {
        lastSync: lastSync ? new Date(lastSync).toISOString() : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sync status",
      error: error.message,
    });
  }
};
