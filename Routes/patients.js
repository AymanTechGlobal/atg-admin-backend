// This file is used to define the routes for the patients
// uses the backend/routes/patientController.js to get the data
// uses RDS DB directly to fetch the data

const express = require("express");
const router = express.Router();
const { getAllPatients } = require("../Controllers/patientController");

// Routes
router.get("/", getAllPatients);

module.exports = router;
