const mongoose = require("mongoose");
const CareNavigator = require("./CareNavigator");

// status, date , time, doctor can be updated
// other data could only be read.
const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    required: [true],
  },
  patientName: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },

  careNeed: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Explain in brief"],
  },

  CareNavigator: {
    type: String,
    required: [true],
    trim: true,
  },
  appointmentDate: {
    type: Date,
  },

  appointmentTime: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: {
      values: ["Scheduled", "Active", "Reschedule", "Postponed"],
      message: "Status must be Scheduled, Active, Reschedule, or Postponed",
    },
    default: "Scheduled",
  },
  Doctor: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
  },
});

module.exports = mongoose.model("appointments", appointmentSchema);
