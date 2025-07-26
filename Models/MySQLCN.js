const db = require("../Config/mysqldb");

async function createCareNavigator(
  username,
  email,
  calendlyName,
  fullName,
  phone
) {
  const cnInsertUsers = `
    INSERT INTO users (username, email, role, status, calendly_name)
    VALUES (?, ?, 1, 3, ?)
  `;
  const cnInsertDetails = `
    INSERT INTO cn_details (cn_username, full_name, contact_number)
    VALUES (?, ?, ?)
  `;

  try {
    console.log("Executing users insert...");
    const userResult = await db.query(cnInsertUsers, [
      username,
      email,
      calendlyName,
    ]);
    console.log("Users insert result:", userResult);

    console.log("Executing cn_details insert...");
    const detailsResult = await db.query(cnInsertDetails, [
      username,
      fullName,
      phone,
    ]);
    console.log("Details insert result:", detailsResult);

    return { success: true };
  } catch (error) {
    console.error("Error adding care navigator to MySQL:", error);
    console.error("Error details:", {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
    });
    return { success: false, error };
  }
}

module.exports = {
  createCareNavigator,
};
