// const mysql = require("mysql2");
const mysql = require("mysql2/promise");

const dbHost = process.env.MYSQL_HOST_NAME;
const dbPort = process.env.MYSQL_PORT;
const dbUser = process.env.MYSQL_DB_USER;
const dbPassword = process.env.MYSQL_DB_PASSWORD;
const dbSchema = process.env.MYSQL_DB_SCHEMA;

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
