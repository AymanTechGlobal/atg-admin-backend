// ---------------------------------------------------------------------------
// This file is used to define the controller for the patients
// uses the backend/models/MySQLPatients.js file to get the data
// uses RDS DB directly to fetch the data
// ---------------------------------------------------------------------------

const PatientModel = require("../Models/MySQLPatients");

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patientsSQL = await PatientModel.getAllPatients();
    res.status(200).json({
      success: true,
      data: patientsSQL,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching patients",
    });
  }
};

module.exports = {
  getAllPatients,
};
