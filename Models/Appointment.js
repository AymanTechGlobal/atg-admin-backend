// ---------------------------------------------------------------------------

// This file is used to define the schema for the appointments
// Not used in the project as we are using the MYSQLAppointments.js file
// but kept it here for reference
// RDS DB is used to retrieve the data not mongodb so no need to use this file

//----------------------------------------------------------------------------

// const mongoose = require("mongoose");

// // status, date , time, doctor can be updated
// // other data could only be read.
// const appointmentSchema = new mongoose.Schema(
//   {
//     appointmentId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     patientName: {
//       type: String,
//       required: true,
//     },
//     CareNavigator: {
//       type: String,
//       required: true,
//     },
//     appointmentDate: {
//       type: Date,
//       required: true,
//     },
//     appointmentTime: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["Active", "Cancelled", "Completed"],
//       default: "Active",
//     },
//     notes: {
//       type: String,
//     },
//     syncTimestamp: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Add index for faster queries
// appointmentSchema.index({ appointmentId: 1 });
// appointmentSchema.index({ status: 1 });
// appointmentSchema.index({ appointmentDate: 1 });

// module.exports = mongoose.model("Appointment", appointmentSchema);


//no need to use the above code as we are using the MYSQLAppointments.js file
