const Appointment = require("../Models/Appointment");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ appointmentDate: -1 })
      .limit(100); // Limit to prevent overwhelming response

    res.status(200).json({
      success: true,
      data: appointments,
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
    const appointment = await Appointment.findOne({
      appointmentId: req.params.id,
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
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

    // Only allow updating status and notes
    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId: req.params.id },
      {
        $set: {
          status: status,
          notes: notes,
          syncTimestamp: new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
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
    const appointment = await Appointment.findOneAndDelete({
      appointmentId: req.params.id,
    });
    if (!appointment) {
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

// Get sync status
exports.getSyncStatus = async (req, res) => {
  try {
    const lastSync = await Appointment.findOne()
      .sort({ syncTimestamp: -1 })
      .select("syncTimestamp");

    res.status(200).json({
      success: true,
      data: {
        lastSync: lastSync ? lastSync.syncTimestamp : null,
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
