// models/Patient.js

const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    submittedAt: {
      type: Date,
      required: true,
    },
    allergies: {
      type: String,
      default: "",
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to avoid re-registering
module.exports =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
