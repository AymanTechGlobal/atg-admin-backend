// ---------------------------------------------------------------------------
// This file is used to define the controller for the admins
// uses the backend/models/Admin.js file to get the data
// uses mongodb to store the data
// ---------------------------------------------------------------------------

const Admin = require("../Models/Admin");
const hashPassword = require("../utils/hashPassword");

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching admins",
    });
  }
};

// Get single admin
const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching admin",
    });
  }
};

// Create admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error creating admin",
    });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const updateData = { name, email, phone };

    // Only update password if provided
    if (password) {
      updateData.password = hashPassword(password);
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error updating admin",
    });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting admin",
    });
  }
};

module.exports = {
  getAllAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
