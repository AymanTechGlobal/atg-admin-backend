const express = require("express"); //importing express for routing
const cors = require("cors"); //importing cors for cross-origin resource sharing
const mongoose = require("mongoose"); //importing mongoose for database connection
const dotenv = require("dotenv"); //importing dotenv for environment variables
const bodyParser = require("body-parser"); //importing body-parser for parsing JSON and URL-encoded bodies
const helmet = require("helmet"); //importing helmet for security headers
const morgan = require("morgan"); //importing morgan for logging

const clientRoute = require("./Routes/client");
const generalRoute = require("./Routes/general");
const managementRoute = require("./Routes/management");
const authRoute = require("./Routes/login");
const logoutRoute = require("./Routes/logout");
// Middleware

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/api/client", clientRoute);
app.use("/api/general", generalRoute);
app.use("/api/management", managementRoute);
app.use("/api/auth", authRoute);
app.use("/api/logout", logoutRoute);

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
