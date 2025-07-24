// ---------------------------------------------------------------------------
// Login route for the admin panel
// uses the backend/routes/adminController.js to get the data
// uses the backend/utils/hashPassword.js to hash the password
// uses the backend/models/Admin.js to get the admin data
// uses the backend/models/User.js to get the user data
// uses the backend/models/jwt.js to create the token
// uses the backend/models/dotenv.js to get the environment variables

// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../Config/mysqldb");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Determine role
    let role = "user";
    if (user.role === 2) role = "admin";
    else if (user.role === 1) role = "care_navigator";
    else if (user.role === 0) role = "patient";

    // Create token
    const token = jwt.sign(
      {
        id: user.id || user.username,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id || user.username,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
