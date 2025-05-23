// ---------------------------------------------------------------------------
// This file is used to define the controller for the care plans
// uses the backend/models/MYSQLCarePlans.js file to get the data
// uses RDS DB directly to fetch the data
// ---------------------------------------------------------------------------

const MySQLCarePlan = require("../Models/MYSQLCarePlans");

exports.getAllCarePlans = async (req, res) => {
  try {
    const carePlansSQL = await MySQLCarePlan.getAllCarePlans();
    const simpleCarePlans = carePlansSQL.map(mapCarePlan);
    res.status(200).json({
      success: true,
      data: simpleCarePlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching care plans",
      error: error.message,
    });
  }
};

function mapCarePlan(carePlan) {
  return {
    _id: carePlan.care_plan_id,
    patientname: carePlan.patient_name,
    careNavigator: carePlan.care_navigator,
    dateCreated: carePlan.date_created,
    date: carePlan.end_date,
    status: carePlan.status,
    actions: carePlan.actions,
  };
}

// Get all care plans
// exports.getAllCarePlans = async (req, res) => {
//   try {
//     const carePlans = await CarePlan.find().sort({ dateCreated: -1 });
//     res.status(200).json({
//       success: true,
//       data: carePlans,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching care plans",
//       error: error.message,
//     });
//   }
// };

// Get single care plan
exports.getCarePlan = async (req, res) => {
  try {
    const carePlan = await CarePlan.findById(req.params.id);
    if (!carePlan) {
      return res.status(404).json({
        success: false,
        message: "Care plan not found",
      });
    }
    res.status(200).json({
      success: true,
      data: carePlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching care plan",
      error: error.message,
    });
  }
};

// Download care plan document
// exports.downloadCarePlan = async (req, res) => {
//   try {
//     const carePlan = await CarePlan.findById(req.params.id);
//     if (!carePlan) {
//       return res.status(404).json({
//         success: false,
//         message: "Care plan not found",
//       });
//     }

//     const fileStream = await getFileStream(carePlan.s3Key);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${carePlan.planName}.pdf`
//     );

//     fileStream.pipe(res);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error downloading care plan",
//       error: error.message,
//     });
//   }
// };

// // Get signed URL for care plan
// exports.getCarePlanSignedUrl = async (req, res) => {
//   try {
//     const carePlan = await CarePlan.findById(req.params.id);
//     if (!carePlan) {
//       return res.status(404).json({
//         success: false,
//         message: "Care plan not found",
//       });
//     }

//     const signedUrl = await getSignedUrl(carePlan.s3Key);

//     res.status(200).json({
//       success: true,
//       data: {
//         signedUrl,
//         fileName: `${carePlan.planName}.pdf`,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error generating signed URL",
//       error: error.message,
//     });
//   }
// };
