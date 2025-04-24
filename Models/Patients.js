const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    careNavigator: {
      type: String,
      required: true,
    },
    regDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Deceased"],
      default: "Active",
    },
    medicalHistory: [
      {
        condition: String,
        diagnosis: String,
        date: Date,
      },
    ],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", PatientSchema);
