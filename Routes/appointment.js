const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getSyncStatus,
} = require("../Controllers/appointmentController");

// Routes
router.get("/", getAllAppointments);
router.get("/sync-status", getSyncStatus);
router.get("/:id", getAppointment);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);

module.exports = router;
