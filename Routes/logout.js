// ---------------------------------------------------------------------------
// logout route for the admin panel
// uses the backend/models/jwt.js to verify the token
// ---------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // Verify and decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // You can add the token to a blacklist here if needed
      // For now, we'll just clear the client-side token

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No token provided",
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
    });
  }
});

module.exports = router;
