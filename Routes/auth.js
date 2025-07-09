// ---------------------------------------------------------------------------
// Auth routes for token validation and user info
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");
const User = require("../Models/User");

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

    // Find user by ID
    let user = await Admin.findById(decoded.id);
    let isAdmin = true;

    if (!user) {
      user = await User.findById(decoded.id);
      isAdmin = false;
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        role: isAdmin ? "admin" : "user",
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

    let user = await Admin.findById(decoded.id);
    let isAdmin = true;

    if (!user) {
      user = await User.findById(decoded.id);
      isAdmin = false;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
