const express = require("express");
const router = express.Router();
const {
  getAllCareNavigators,
  getCareNavigator,
  createCareNavigator,
  updateCareNavigator,
  deleteCareNavigator,
} = require("../Controllers/careNavigatorController");
const { protect } = require("../middleware/auth");

// Routes
router.use(protect); // Protect all routes
router.get("/", getAllCareNavigators);
router.get("/:id", getCareNavigator);
router.post("/", createCareNavigator);
router.put("/:id", updateCareNavigator);
router.delete("/:id", deleteCareNavigator);

module.exports = router;
