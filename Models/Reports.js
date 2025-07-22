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

// Patient Analytics
async function getPatientAnalytics() {
  // Registration trends (monthly for last 12 months)
  const [registrationTrends] = await db.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as newPatients
     FROM users WHERE role = 0
     GROUP BY period ORDER BY period DESC LIMIT 12`
  );
  // Age groups
  const [ageGroups] = await db.query(
    `SELECT 
      CASE 
        WHEN TIMESTAMPDIFF(YEAR, cd.date_of_birth, CURDATE()) < 18 THEN '<18'
        WHEN TIMESTAMPDIFF(YEAR, cd.date_of_birth, CURDATE()) BETWEEN 18 AND 29 THEN '18-29'
        WHEN TIMESTAMPDIFF(YEAR, cd.date_of_birth, CURDATE()) BETWEEN 30 AND 44 THEN '30-44'
        WHEN TIMESTAMPDIFF(YEAR, cd.date_of_birth, CURDATE()) BETWEEN 45 AND 64 THEN '45-64'
        ELSE '65+'
      END as ageGroup,
      COUNT(*) as count
     FROM client_details cd
     JOIN users u ON cd.client_username = u.username
     WHERE u.role = 0 AND cd.date_of_birth IS NOT NULL
     GROUP BY ageGroup`
  );
  // Health conditions (known_allergies as proxy)
  const [healthConditions] = await db.query(
    `SELECT known_allergies as condition, COUNT(*) as count
     FROM client_details WHERE known_allergies IS NOT NULL AND known_allergies != ''
     GROUP BY known_allergies ORDER BY count DESC LIMIT 10`
  );
  // Retention: patients active in last 30 days
  const [[{ recentPatients }]] = await db.query(
    `SELECT COUNT(*) as recentPatients FROM users WHERE role = 0 AND last_login >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
  );
  const [[{ totalPatients }]] = await db.query(
    `SELECT COUNT(*) as totalPatients FROM users WHERE role = 0`
  );
  const retentionRate = totalPatients
    ? Math.round((recentPatients / totalPatients) * 100)
    : 0;
  return {
    registrationTrends,
    ageGroups,
    healthConditions,
    retention: { retentionRate, recentPatients },
  };
}

// Care Navigator Performance
async function getCareNavigatorPerformance() {
  // Get all care navigators
  const [navigators] = await db.query(
    `SELECT u.username, u.calendly_name, u.status FROM users u WHERE u.role = 1`
  );
  // For each navigator, get care plans and appointments
  const results = await Promise.all(
    navigators.map(async (nav) => {
      const [[{ totalCarePlans }]] = await db.query(
        `SELECT COUNT(*) as totalCarePlans FROM care_plans WHERE care_navigator_username = ?`,
        [nav.username]
      );
      const [[{ activeCarePlans }]] = await db.query(
        `SELECT COUNT(*) as activeCarePlans FROM care_plans WHERE care_navigator_username = ? AND status = 'active'`,
        [nav.username]
      );
      const [[{ completionRate }]] = await db.query(
        `SELECT IFNULL(ROUND((SUM(status = 'completed')/COUNT(*))*100),0) as completionRate FROM care_plans WHERE care_navigator_username = ?`,
        [nav.username]
      );
      const [[{ totalAppointments }]] = await db.query(
        `SELECT COUNT(*) as totalAppointments FROM client_appointments WHERE care_navigator_username = ?`,
        [nav.username]
      );
      const [[{ appointmentCompletionRate }]] = await db.query(
        `SELECT IFNULL(ROUND((SUM(status = 'completed')/COUNT(*))*100),0) as appointmentCompletionRate FROM client_appointments WHERE care_navigator_username = ?`,
        [nav.username]
      );
      return {
        id: nav.username,
        name: nav.calendly_name || nav.username,
        status: nav.status === 1 ? "Active" : "Inactive",
        carePlans: {
          total: totalCarePlans,
          active: activeCarePlans,
          completionRate: completionRate,
        },
        appointments: {
          total: totalAppointments,
          completionRate: appointmentCompletionRate,
        },
      };
    })
  );
  return results;
}

// Appointment Analytics
async function getAppointmentAnalytics(startDate, endDate) {
  let dateFilter = "";
  let params = [];
  if (startDate && endDate) {
    dateFilter = "WHERE appointment_date_time BETWEEN ? AND ?";
    params = [startDate, endDate];
  }
  // Trends (daily for last 30 days)
  const [trends] = await db.query(
    `SELECT DATE(appointment_date_time) as date, COUNT(*) as totalAppointments,
      SUM(status = 'completed') as completed, SUM(status = 'cancelled') as cancelled
     FROM client_appointments ${dateFilter}
     GROUP BY date ORDER BY date DESC LIMIT 30`,
    params
  );
  // Status distribution
  const [statusDistribution] = await db.query(
    `SELECT status, COUNT(*) as count, ROUND(COUNT(*)/(SELECT COUNT(*) FROM client_appointments)*100,1) as percentage
     FROM client_appointments GROUP BY status`
  );
  // Peak times (by hour)
  const [peakTimes] = await db.query(
    `SELECT HOUR(appointment_date_time) as hour, COUNT(*) as appointmentCount
     FROM client_appointments GROUP BY hour ORDER BY appointmentCount DESC LIMIT 10`
  );
  // Average duration (in minutes)
  const [[{ avgDuration }]] = await db.query(
    `SELECT AVG(TIMESTAMPDIFF(MINUTE, appointment_date_time, end_time)) as avgDuration FROM client_appointments WHERE end_time IS NOT NULL`
  );
  return {
    trends,
    statusDistribution,
    peakTimes,
    avgDuration: Math.round(avgDuration || 0),
  };
}

// Care Plan Effectiveness
async function getCarePlanEffectiveness() {
  // Status distribution
  const [statusDistribution] = await db.query(
    `SELECT status, COUNT(*) as count, ROUND(COUNT(*)/(SELECT COUNT(*) FROM care_plans)*100,1) as percentage
     FROM care_plans GROUP BY status`
  );
  // Completion trends (monthly)
  const [completionTrends] = await db.query(
    `SELECT DATE_FORMAT(date_created, '%Y-%m') as month, ROUND(SUM(status = 'completed')/COUNT(*)*100,1) as completionRate
     FROM care_plans GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  // Duration stats (days)
  const [[{ avgDuration }]] = await db.query(
    `SELECT AVG(DATEDIFF(end_date, date_created)) as avgDuration FROM care_plans WHERE end_date IS NOT NULL`
  );
  const [[{ minDuration }]] = await db.query(
    `SELECT MIN(DATEDIFF(end_date, date_created)) as minDuration FROM care_plans WHERE end_date IS NOT NULL`
  );
  const [[{ maxDuration }]] = await db.query(
    `SELECT MAX(DATEDIFF(end_date, date_created)) as maxDuration FROM care_plans WHERE end_date IS NOT NULL`
  );
  // Common actions
  const [commonActions] = await db.query(
    `SELECT actions, COUNT(*) as count FROM care_plans WHERE actions IS NOT NULL AND actions != '' GROUP BY actions ORDER BY count DESC LIMIT 10`
  );
  return {
    statusDistribution,
    completionTrends,
    durationStats: { avgDuration, minDuration, maxDuration },
    commonActions,
  };
}

// System Usage Analytics
async function getSystemUsageAnalytics() {
  // Admin metrics
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) as total FROM users WHERE role = 2`
  );
  const [[{ active }]] = await db.query(
    `SELECT COUNT(*) as active FROM users WHERE role = 2 AND status = 1`
  );
  const [[{ inactive }]] = await db.query(
    `SELECT COUNT(*) as inactive FROM users WHERE role = 2 AND status = 0`
  );
  // Message metrics
  const [[{ total: totalMessages }]] = await db.query(
    `SELECT COUNT(*) as total FROM messages`
  );
  const [[{ sendRate }]] = await db.query(
    `SELECT IFNULL(ROUND((SUM(status = 'sent')/COUNT(*))*100,1),0) as sendRate FROM messages`
  );
  // System health
  const [[{ totalUsers }]] = await db.query(
    `SELECT COUNT(*) as totalUsers FROM users`
  );
  const [[{ growthRate }]] = await db.query(
    `SELECT IFNULL(ROUND((COUNT(*) - (SELECT COUNT(*) FROM users WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH)))/(SELECT COUNT(*) FROM users WHERE created_at < DATE_SUB(CURDATE(), INTERVAL 1 MONTH))*100,1),0) as growthRate FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)`
  );
  // Recent activity (last 10)
  const [recentActivity] = await db.query(
    `SELECT type, user, action, timestamp FROM activity_log ORDER BY timestamp DESC LIMIT 10`
  );
  return {
    adminMetrics: { total, active, inactive },
    messageMetrics: { total: totalMessages, sendRate },
    systemHealth: { totalUsers, growthRate },
    recentActivity,
  };
}

module.exports = {
  getBusinessOverview,
  getPatientAnalytics,
  getCareNavigatorPerformance,
  getAppointmentAnalytics,
  getCarePlanEffectiveness,
  getSystemUsageAnalytics,
};
