// ---------------------------------------------------------------------------
// This file is used to define the controller for the reports and analytics
// Provides comprehensive business insights for super admin decision making
// Uses both MongoDB and RDS DB to fetch aggregated data
// ---------------------------------------------------------------------------

const db = require("../Config/mysqldb");
const CareNavigator = require("../Models/CareNavigator");
const Admin = require("../Models/Admin");
const Message = require("../Models/Message");
const ReportsModel = require("../Models/Reports");

// Get comprehensive business overview
exports.getBusinessOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsModel.getBusinessOverview(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching business overview:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching business overview" });
  }
};

// Get patient analytics and trends
exports.getPatientAnalytics = async (req, res) => {
  try {
    const data = await ReportsModel.getPatientAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching patient analytics:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching patient analytics" });
  }
};

// Get care navigator performance metrics
exports.getCareNavigatorPerformance = async (req, res) => {
  try {
    const data = await ReportsModel.getCareNavigatorPerformance();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching care navigator performance:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Error fetching care navigator performance",
      });
  }
};

// Get appointment analytics
exports.getAppointmentAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsModel.getAppointmentAnalytics(startDate, endDate);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching appointment analytics:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching appointment analytics" });
  }
};

// Get care plan effectiveness
exports.getCarePlanEffectiveness = async (req, res) => {
  try {
    const data = await ReportsModel.getCarePlanEffectiveness();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching care plan effectiveness:", error);
    res
      .status(500)
      .json({
        success: false,
        error: "Error fetching care plan effectiveness",
      });
  }
};

// Get system usage analytics
exports.getSystemUsageAnalytics = async (req, res) => {
  try {
    const data = await ReportsModel.getSystemUsageAnalytics();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching system usage analytics:", error);
    res
      .status(500)
      .json({ success: false, error: "Error fetching system usage analytics" });
  }
};
