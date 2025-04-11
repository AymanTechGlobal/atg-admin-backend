const express = require("express");
const router = express.Router();
const CareNavigator = require("../Models/CareNavigator");

// Get all care navigators
router.get("/care-navigators", async (req, res) => {
  try {
    console.log("Fetching all care navigators");
    const navigators = await CareNavigator.find().sort({ createdAt: -1 });
    console.log(`Found ${navigators.length} care navigators`);
    res.status(200).json({
      success: true,
      count: navigators.length,
      data: navigators,
    });
  } catch (error) {
    console.error("Error in GET /care-navigators:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching care navigators",
      error: error.message,
    });
  }
});

// Create a new care navigator
router.post("/care-navigators", async (req, res) => {
  try {
    console.log("Creating new care navigator:", req.body);
    const { name, email, phone, status } = req.body;

    // Check if email already exists
    const existingNavigator = await CareNavigator.findOne({ email });
    if (existingNavigator) {
      console.log("Email already exists:", email);
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const navigator = new CareNavigator({
      name,
      email,
      phone,
      status: status || "Active",
    });

    const savedNavigator = await navigator.save();
    console.log("Care navigator created successfully:", savedNavigator._id);
    res.status(201).json({
      success: true,
      data: savedNavigator,
    });
  } catch (error) {
    console.error("Error in POST /care-navigators:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating care navigator",
      error: error.message,
    });
  }
});

// Update a care navigator
router.put("/care-navigators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;
    console.log(`Updating care navigator ${id}:`, req.body);

    // Check if the navigator exists
    const navigator = await CareNavigator.findById(id);
    if (!navigator) {
      console.log("Care navigator not found:", id);
      return res.status(404).json({
        success: false,
        message: "Care navigator not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== navigator.email) {
      const existingNavigator = await CareNavigator.findOne({ email });
      if (existingNavigator) {
        console.log("Email already exists:", email);
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
    }

    const updatedNavigator = await CareNavigator.findByIdAndUpdate(
      id,
      { name, email, phone, status },
      { new: true, runValidators: true }
    );

    console.log("Care navigator updated successfully:", id);
    res.status(200).json({
      success: true,
      data: updatedNavigator,
    });
  } catch (error) {
    console.error("Error in PUT /care-navigators/:id:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating care navigator",
      error: error.message,
    });
  }
});

// Delete a care navigator
router.delete("/care-navigators/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting care navigator ${id}`);

    const navigator = await CareNavigator.findById(id);
    if (!navigator) {
      console.log("Care navigator not found:", id);
      return res.status(404).json({
        success: false,
        message: "Care navigator not found",
      });
    }

    await CareNavigator.findByIdAndDelete(id);
    console.log("Care navigator deleted successfully:", id);
    res.status(200).json({
      success: true,
      message: "Care navigator deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /care-navigators/:id:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting care navigator",
      error: error.message,
    });
  }
});

module.exports = router;
