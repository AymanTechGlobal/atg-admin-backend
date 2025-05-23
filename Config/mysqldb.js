// ---------------------------------------------------------------------------
// This file is used to connect to the MySQL database
// uses RDS DB directly to fetch the data
// ---------------------------------------------------------------------------

require("dotenv").config();
const mysql = require("mysql2/promise");

// Get DB config from environment variables
const dbHost =
  process.env.MYSQL_HOST_NAME ||
  "atghealthcare.cjmme44o6mb1.ap-south-1.rds.amazonaws.com";
const dbPort = process.env.MYSQL_PORT || 3306;
const dbUser = process.env.MYSQL_DB_USER || "app_user";
const dbPassword = process.env.MYSQL_DB_PASSWORD || "atgappuser.12";
const dbSchema = process.env.MYSQL_DB_SCHEMA || "atghealthcare";

// Log config for debugging (do not log password in production)
console.log(
  "DB HOST:",
  dbHost,
  "PORT:",
  dbPort,
  "USER:",
  dbUser,
  "DB:",
  dbSchema
);

// Create a connection pool (recommended over single connection)
const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbSchema,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export for use in other files
module.exports = pool;

console.log(
  "DB HOST:",
  dbHost,
  "PORT:",
  dbPort,
  "USER:",
  dbUser,
  "DB:",
  dbSchema
);
