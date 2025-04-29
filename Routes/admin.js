const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../Controllers/adminController");
const { protect } = require("../middleware/auth");

// Routes
router.use(protect); // Protect all routes
router.get("/", getAllAdmins);
router.get("/:id", getAdmin);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

module.exports = router;
