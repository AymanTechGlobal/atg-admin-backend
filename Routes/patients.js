const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatient,
  getPatientStats,
} = require("../Controllers/patientController");

// Routes
router.get("/", getAllPatients);
router.get("/stats", getPatientStats);
router.get("/:id", getPatient);

module.exports = router;
