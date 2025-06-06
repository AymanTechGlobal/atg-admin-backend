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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return this.password === enteredPassword;
};

module.exports = mongoose.model("User", UserSchema);
