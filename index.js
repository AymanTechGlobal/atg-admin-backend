// ---------------------------------------------------------------------------

// This file is the main file for the API
// uses mongodb to store the data
// uses the backend/models/dotenv.js to get the environment variables
// uses the backend/models/mongoose.js to connect to the database
// uses the backend/models/cors.js to allow cross-origin resource sharing
// uses the backend/models/helmet.js to secure the headers
// uses the backend/models/morgan.js to log the requests
// uses the backend/models/body-parser.js to parse the JSON and URL-encoded bodies

// ---------------------------------------------------------------------------

const express = require("express"); //importing express for routing
const cors = require("cors"); //importing cors for cross-origin resource sharing
const mongoose = require("mongoose"); //importing mongoose for database connection
const dotenv = require("dotenv"); //importing dotenv for environment variables
const bodyParser = require("body-parser"); //importing body-parser for parsing JSON and URL-encoded bodies
const helmet = require("helmet"); //importing helmet for security headers
const morgan = require("morgan"); //importing morgan for logging

// Import routes

const authRoute = require("./Routes/login");
const logoutRoute = require("./Routes/logout");
const appointmentRoute = require("./Routes/appointment");
const carePlanRoute = require("./Routes/carePlan");
const patientRoute = require("./Routes/patients");
const careNavigatorRoute = require("./Routes/careNavigator");
const adminRoute = require("./Routes/admin");
const dashboardRoute = require("./Routes/dashboard");
const messageRoute = require("./Routes/message");
const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: [
    "https://atgadmin.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(helmet());
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ATG Admin Backend API is running",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/dashboard", dashboardRoute);
app.use("/api/auth", authRoute);
app.use("/api/logout", logoutRoute);
app.use("/api/appointments", appointmentRoute);
app.use("/api/careplans", carePlanRoute);
app.use("/api/patients", patientRoute);
app.use("/api/care-navigators", careNavigatorRoute);
app.use("/api/admin", adminRoute);
app.use("/api/messages", messageRoute);

// MongoDB Connection
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Connected to MongoDB successfully!");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
