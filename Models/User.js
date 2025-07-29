// ---------------------------------------------------------------------------

// This file is used to define the schema for the users added to the admin panel (new admins)
// uses mongodb to store the data

// ---------------------------------------------------------------------------

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  contact: {
    type: Number,
    required: [true, "Please provide a contact number"],
  },
  // Password reset fields
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  // Remember me functionality
  rememberMeToken: {
    type: String,
  },
  rememberMeExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return this.password === enteredPassword;
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  const resetToken = require("crypto").randomBytes(32).toString("hex");
  this.resetPasswordToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate remember me token
UserSchema.methods.generateRememberMeToken = function () {
  const rememberToken = require("crypto").randomBytes(32).toString("hex");
  this.rememberMeToken = require("crypto")
    .createHash("sha256")
    .update(rememberToken)
    .digest("hex");
  this.rememberMeExpires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  return rememberToken;
};

module.exports = mongoose.model("User", UserSchema);
