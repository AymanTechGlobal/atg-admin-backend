// ---------------------------------------------------------------------------
// This file is used to define the schema for the patients
// Not used in the project as we are using the MYSQLPatients.js file 
// but kept it here for reference
// RDS DB is used to retrieve the data not mongodb so no need to use this file
// ---------------------------------------------------------------------------

// const mongoose = require("mongoose");

// const PatientSchema = new mongoose.Schema(
//   {
//     patientId: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () => uuidv4(),
//     },
//     submittedAt: {
//       type: Date,
//       required: true,
//     },
//     allergies: {
//       type: String,
//       default: "",
//     },
//     contactNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     dateOfBirth: {
//       type: Date,
//       required: true,
//     },
//     fullName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     gender: {
//       type: String,
//       required: true,
//       enum: ["Male", "Female", "Other"],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Check if model already exists to avoid re-registering
// module.exports =
//   mongoose.models.Patient || mongoose.model("Patient", PatientSchema);


//no need to use the above code as we are using the MYSQLPatients.js file
