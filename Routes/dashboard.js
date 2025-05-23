// This file is used to define the routes for the dashboard
// uses the backend/routes/dashboardController.js to get the data
// uses RDS DB directly to fetch the data

const express = require("express");
const router = express.Router();
const dashboardController = require("../Controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
