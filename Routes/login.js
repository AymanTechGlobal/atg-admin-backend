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
const nodemailer = require("nodemailer");

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

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

    // Check if user is active
    if (user.isActive === false) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // Hash the provided password
    const hashedPassword = hashPassword(password);

    // Check if password matches
    const isMatch = await user.matchPassword(hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set token expiration based on remember me
    const tokenExpiration = rememberMe ? "30d" : "1h";

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: isAdmin ? "admin" : "user",
        rememberMe: !!rememberMe,
      },
      process.env.JWT_SECRET,
      { expiresIn: tokenExpiration }
    );

    // If remember me is enabled, generate and store remember me token
    if (rememberMe && isAdmin) {
      const rememberMeToken = user.generateRememberMeToken();
      await user.save();
    }

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: isAdmin ? "admin" : "user",
        rememberMe: !!rememberMe,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Request password reset
// @route   POST /api/auth/reset-password-request
// @access  Public
router.post("/reset-password-request", async (req, res) => {
  const { email } = req.body;

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
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${
      process.env.FRONTEND_URL || "https://atgadmin.vercel.app"
    }/reset-password?token=${resetToken}`;

    // Send email
    try {
      const transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request - ATG Admin",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>You requested a password reset for your ATG Admin account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Reset Password
            </a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>ATG Admin Team</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Clear the reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res
        .status(500)
        .json({ message: "Failed to send reset email. Please try again." });
    }
  } catch (error) {
    console.error("Password reset request error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    // Hash the token to compare with stored hash
    const hashedToken = require("crypto")
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid reset token
    let user = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    let isAdmin = true;

    if (!user) {
      user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
      isAdmin = false;
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = hashPassword(newPassword);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
