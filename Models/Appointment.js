const mongoose = require("mongoose");

// status, date , time, doctor can be updated
// other data could only be read.
const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    CareNavigator: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Cancelled", "Completed"],
      default: "Active",
    },
    notes: {
      type: String,
    },
    syncTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
appointmentSchema.index({ appointmentId: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
