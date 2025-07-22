// ---------------------------------------------------------------------------
// This file is used to define the routes for the reports and analytics
// Provides comprehensive business insights for super admin decision making
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const {
  getBusinessOverview,
  getPatientAnalytics,
  getCareNavigatorPerformance,
  getAppointmentAnalytics,
  getCarePlanEffectiveness,
  getSystemUsageAnalytics,
} = require("../Controllers/reportsController");

// Get comprehensive business overview
router.get("/business-overview", getBusinessOverview);

// Get patient analytics and trends
router.get("/patient-analytics", getPatientAnalytics);

// Get care navigator performance metrics
router.get("/care-navigator-performance", getCareNavigatorPerformance);

// Get appointment analytics
router.get("/appointment-analytics", getAppointmentAnalytics);

// Get care plan effectiveness
router.get("/care-plan-effectiveness", getCarePlanEffectiveness);

// Get system usage analytics
router.get("/system-usage", getSystemUsageAnalytics);

module.exports = router;
