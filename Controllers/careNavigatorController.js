// ---------------------------------------------------------------------------
// This file is used to define the controller for the care navigators
// uses the backend/models/CareNavigator.js file to get the data
// uses mongodb to store the data
// ---------------------------------------------------------------------------

const CareNavigator = require("../Models/CareNavigator");
const CNModel = require("../Models/MySQLCN");
const fetch = require("node-fetch");

const API_GATEWAY_URL =
  "https://uqzl6jyqvg.execute-api.ap-south-1.amazonaws.com/dev/adminCreateCN";

// Get all care navigators
const getAllCareNavigators = async (req, res) => {
  try {
    const navigators = await CareNavigator.find().sort({ dateJoined: -1 });
    res.status(200).json({
      success: true,
      data: navigators,
    });
  } catch (error) {
    console.error("Error fetching care navigators:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching care navigators",
    });
  }
};

// Get single care navigator
const getCareNavigator = async (req, res) => {
  try {
    const navigator = await CareNavigator.findById(req.params.id);
    if (!navigator) {
      return res.status(404).json({
        success: false,
        error: "Care navigator not found",
      });
    }
    res.status(200).json({
      success: true,
      data: navigator,
    });
  } catch (error) {
    console.error("Error fetching care navigator:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching care navigator",
    });
  }
};

// Create care navigator
const createCareNavigator = async (req, res) => {
  try {
    console.log("Hi this is working...");
    console.log("Hi this is working...");
    const cnUsername = req.body.username;
    const cnEmail = req.body.email;
    const cnCalendlyName = req.body.calendlyName;
    const cnName = req.body.name;
    const cnPhone = req.body.phone;

    // Call the Cognito Lambda function via API Gateway
    const lambdaResponse = await fetch(API_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: cnUsername,
        email: cnEmail,
      }),
    });

    const lambdaResult = await lambdaResponse.json();
    const parsedBody =
      typeof lambdaResult.body === "string"
        ? JSON.parse(lambdaResult.body)
        : lambdaResult.body;

    if (lambdaResult.statusCode !== 200 || !parsedBody.success) {
      return res.status(lambdaResult.statusCode).json({
        success: false,
        message: parsedBody.message || "Failed to create user in Cognito",
        code: parsedBody.code || "UnknownError",
      });
    }

    // Create CN in MySQL database
    await CNModel.createCareNavigator(
      cnUsername,
      cnEmail,
      cnCalendlyName,
      cnName,
      cnPhone
    );

    // Ensure username and calendly name don't already have prefixes
    if (req.body.username?.startsWith("cn_")) {
      req.body.username = req.body.username.substring(3);
    }

    const navigator = await CareNavigator.create(req.body);
    res.status(201).json({
      success: true,
      data: navigator,
    });
  } catch (error) {
    console.error("Error creating care navigator:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error creating care navigator",
    });
  }
};

// Update care navigator
const updateCareNavigator = async (req, res) => {
  try {
    // Ensure username and calendly name don't already have prefixes
    if (req.body.username?.startsWith("cn_")) {
      req.body.username = req.body.username.substring(3);
    }

    const navigator = await CareNavigator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!navigator) {
      return res.status(404).json({
        success: false,
        error: "Care navigator not found",
      });
    }
    res.status(200).json({
      success: true,
      data: navigator,
    });
  } catch (error) {
    console.error("Error updating care navigator:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Error updating care navigator",
    });
  }
};

// Delete care navigator
const deleteCareNavigator = async (req, res) => {
  try {
    const navigator = await CareNavigator.findByIdAndDelete(req.params.id);
    if (!navigator) {
      return res.status(404).json({
        success: false,
        error: "Care navigator not found",
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting care navigator:", error);
    res.status(500).json({
      success: false,
      error: "Error deleting care navigator",
    });
  }
};

module.exports = {
  getAllCareNavigators,
  getCareNavigator,
  createCareNavigator,
  updateCareNavigator,
  deleteCareNavigator,
};
