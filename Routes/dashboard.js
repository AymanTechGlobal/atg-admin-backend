const express = require("express");
const router = express.Router();
const dashboardController = require("../Controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
