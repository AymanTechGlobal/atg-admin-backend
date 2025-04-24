const Patient = require("../Models/Patients");

// Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ regDate: -1 });
    const totalPatients = await Patient.countDocuments();

    res.status(200).json({
      success: true,
      count: totalPatients,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching patients",
      error: error.message,
    });
  }
};

// Get single patient
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching patient",
      error: error.message,
    });
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: "Error fetching patient statistics",
      error: error.message,
    });
  }
};
