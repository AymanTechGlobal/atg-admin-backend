const express = require('express');
const router = express.Router();
const {
  getAllCarePlans,
  getCarePlan,
  downloadCarePlan,
  getCarePlanSignedUrl
} = require('../Controllers/carePlanController');

// Routes
router.get('/', getAllCarePlans);
router.get('/:id', getCarePlan);
router.get('/:id/document', downloadCarePlan);
router.get('/:id/signed-url', getCarePlanSignedUrl);

module.exports = router; 