// ---------------------------------------------------------------------------
// This file is used to define the schema for the admins
// uses mongodb to store the data

// created for the admin panel (existing admins)

// ---------------------------------------------------------------------------

const mongoose = require("mongoose");
const hashPassword = require("../utils/hashPassword");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
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
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "super-admin"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  {
    timestamps: true,
  }
);

// Match admin entered password to hashed password in database
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return this.password === enteredPassword;
};

// Generate password reset token
AdminSchema.methods.generatePasswordResetToken = function () {
  const resetToken = require("crypto").randomBytes(32).toString("hex");
  this.resetPasswordToken = require("crypto")
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate remember me token
AdminSchema.methods.generateRememberMeToken = function () {
  const rememberToken = require("crypto").randomBytes(32).toString("hex");
  this.rememberMeToken = require("crypto")
    .createHash("sha256")
    .update(rememberToken)
    .digest("hex");
  this.rememberMeExpires = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  return rememberToken;
};

module.exports = mongoose.model("Admin", AdminSchema);
