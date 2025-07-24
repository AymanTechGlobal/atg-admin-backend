// ---------------------------------------------------------------------------
// Auth routes for token validation and user info
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../Config/mysqldb");

// @desc    Validate token and get user info
// @route   GET /api/auth/validate
// @access  Private
router.get("/validate", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by id or username
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ? OR username = ?",
      [decoded.id, decoded.id]
    );
    if (!rows.length) {
      return res.status(401).json({ message: "User not found" });
    }
    const user = rows[0];
    let role = "user";
    if (user.role === 2) role = "admin";
    else if (user.role === 1) role = "care_navigator";
    else if (user.role === 0) role = "patient";
    res.json({
      valid: true,
      user: {
        id: user.id || user.username,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// @desc    Get current user info
// @route   GET /api/auth/me
// @access  Private
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ? OR username = ?",
      [decoded.id, decoded.id]
    );
    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    let role = "user";
    if (user.role === 2) role = "admin";
    else if (user.role === 1) role = "care_navigator";
    else if (user.role === 0) role = "patient";
    res.json({
      user: {
        id: user.id || user.username,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
