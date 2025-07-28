const db = require("../Config/mysqldb");

// Business Overview
async function getBusinessOverview(startDate, endDate) {
  // Date filter for optional range
  let dateFilter = "";
  if (startDate && endDate) {
    dateFilter = `AND u.created_at BETWEEN ? AND ?`;
  }
  // Total patients
  const [[{ totalPatients }]] = await db.query(
    `SELECT COUNT(*) as totalPatients FROM users u WHERE u.role = 0 ${dateFilter}`,
    startDate && endDate ? [startDate, endDate] : []
  );
  // New patients this month
  const [[{ newPatientsThisMonth }]] = await db.query(
    `SELECT COUNT(*) as newPatientsThisMonth FROM users WHERE role = 0 AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
  );
  // Growth rate (last month vs this month)
  const [[{ lastMonth }]] = await db.query(
    `SELECT COUNT(*) as lastMonth FROM users WHERE role = 0 AND MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(created_at) = YEAR(CURRENT_DATE())`
  );
  const growthRate = lastMonth
    ? Math.round(((newPatientsThisMonth - lastMonth) / lastMonth) * 100)
    : 0;
  // Active/inactive patients
  const [[{ activePatients }]] = await db.query(
    `SELECT COUNT(*) as activePatients FROM users WHERE role = 0 AND status = 1`
  );
  const [[{ inactivePatients }]] = await db.query(
    `SELECT COUNT(*) as inactivePatients FROM users WHERE role = 0 AND status = 0`
  );
  // Care navigators
  const [[{ totalCareNavigators }]] = await db.query(
    `SELECT COUNT(*) as totalCareNavigators FROM users WHERE role = 1`
  );
  // Appointments
  const [[{ totalAppointments }]] = await db.query(
    `SELECT COUNT(*) as totalAppointments FROM client_appointments`
  );
  // Care plans
  const [[{ totalCarePlans }]] = await db.query(
    `SELECT COUNT(*) as totalCarePlans FROM care_plans`
  );
  // Appointment status distribution
  const [appointmentStats] = await db.query(
    `SELECT status, COUNT(*) as count FROM client_appointments GROUP BY status`
  );
  // Completion rate
  const [[{ completed }]] = await db.query(
    `SELECT COUNT(*) as completed FROM client_appointments WHERE status = 'completed'`
  );
  const completionRate = totalAppointments
    ? Math.round((completed / totalAppointments) * 100)
    : 0;

  return {
    overview: {
      totalPatients,
      totalCareNavigators,
      totalAppointments,
      totalCarePlans,
      activePatients,
      inactivePatients,
      completionRate,
    },
    growth: {
      newPatientsThisMonth,
      growthRate,
    },
    appointmentStats,
  };
}

// Convert business overview data to CSV format
function convertToCSV(data, reportType) {
  if (reportType !== "business-overview") {
    return "No data available\n";
  }

  let csvContent = "Metric,Value\n";
  csvContent += `Total Patients,${data.overview.totalPatients}\n`;
  csvContent += `Total Care Navigators,${data.overview.totalCareNavigators}\n`;
  csvContent += `Total Appointments,${data.overview.totalAppointments}\n`;
  csvContent += `Total Care Plans,${data.overview.totalCarePlans}\n`;
  csvContent += `Active Patients,${data.overview.activePatients}\n`;
  csvContent += `Inactive Patients,${data.overview.inactivePatients}\n`;
  csvContent += `Completion Rate,${data.overview.completionRate}%\n`;
  csvContent += `New Patients This Month,${data.growth.newPatientsThisMonth}\n`;
  csvContent += `Growth Rate,${data.growth.growthRate}%\n`;

  return csvContent;
}

module.exports = {
  getBusinessOverview,
  convertToCSV,
};
