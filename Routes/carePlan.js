//---------------------------------------------------------------------------

// This file is used to define the routes for the care plans
// uses the backend/routes/carePlanController.js to get the data
// uses RDS DB directly to fetch the data

// currently only get all care plans is implemented

//----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const {
  getAllCarePlans,
  // getCarePlan,
  // downloadCarePlan,
  // getCarePlanSignedUrl,
} = require("../Controllers/carePlanController");

// Routes
router.get("/", getAllCarePlans);
// router.get("/:id", getCarePlan);
// router.get("/:id/document", downloadCarePlan);
// router.get("/:id/signed-url", getCarePlanSignedUrl);

module.exports = router;
