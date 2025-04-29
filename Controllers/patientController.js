const Patient = require("../Models/Patients");

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ submittedAt: -1 });
    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching patients",
    });
  }
};

// Get single patient
const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.params.id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
      });
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("Error fetching patient:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching patient",
    });
  }
};

// Get patient statistics
const getPatientStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const activePatients = await Patient.countDocuments({ status: "Active" });
    const inactivePatients = await Patient.countDocuments({
      status: "Inactive",
    });
    const deceasedPatients = await Patient.countDocuments({
      status: "Deceased",
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalPatients,
        active: activePatients,
        inactive: inactivePatients,
        deceased: deceasedPatients,
      },
    });
  } catch (error) {
    console.error("Error fetching patient statistics:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching patient statistics",
    });
  }
};

module.exports = {
  getAllPatients,
  getPatient,
  getPatientStats,
};
