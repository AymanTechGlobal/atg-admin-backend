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

// Export business overview report
exports.exportReport = async (req, res) => {
  try {
    const { format = "csv", startDate, endDate } = req.query;

    const data = await ReportsModel.getBusinessOverview(startDate, endDate);

    if (format === "json") {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="business-overview-${
          new Date().toISOString().split("T")[0]
        }.json"`
      );
      res.json(data);
    } else {
      // Convert to CSV
      const csvData = ReportsModel.convertToCSV(data, "business-overview");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="business-overview-${
          new Date().toISOString().split("T")[0]
        }.csv"`
      );
      res.send(csvData);
    }
  } catch (error) {
    console.error("Error exporting report:", error);
    res.status(500).json({ success: false, error: "Error exporting report" });
  }
};
