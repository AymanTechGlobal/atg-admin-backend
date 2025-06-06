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
const User = require("../Models/User");
const Admin = require("../Models/Admin");
const dotenv = require("dotenv");
const hashPassword = require("../utils/hashPassword");

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin first
    let user = await Admin.findOne({ email });
    let isAdmin = true;

    // If not found in admin collection, check user collection
    if (!user) {
      user = await User.findOne({ email });
      isAdmin = false;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Hash the provided password
    const hashedPassword = hashPassword(password);

    // Check if password matches
    const isMatch = await user.matchPassword(hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: isAdmin ? "admin" : "user",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // 1 hour token expiration
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: isAdmin ? "admin" : "user",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
