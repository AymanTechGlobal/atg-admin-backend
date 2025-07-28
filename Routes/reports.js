// ---------------------------------------------------------------------------
// This file is used to define the routes for the reports and analytics
// Provides comprehensive business insights for super admin decision making
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const {
  getBusinessOverview,
  exportReport,
} = require("../Controllers/reportsController");

// Get comprehensive business overview
router.get("/business-overview", getBusinessOverview);

// Export business overview report
router.get("/export", exportReport);

module.exports = router;
