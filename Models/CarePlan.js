const mongoose = require("mongoose");

const carePlanSchema = new mongoose.Schema(
  {
    patientname: {
      type: String,
      required: true,
    },
    careNavigator: {
      type: String,
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
    s3Key: {
      type: String,
      required: true,
    },
    s3Url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CarePlan", carePlanSchema);
