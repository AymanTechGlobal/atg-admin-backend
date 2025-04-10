const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const clientRoute = require("./Routes/client");
const generalRoute = require("./Routes/general");
const managementRoute = require("./Routes/management");
const authRoute = require("./Routes/login");
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
app.use("/client", clientRoute);
app.use("/general", generalRoute);
app.use("/management", managementRoute);
app.use("/api/auth", authRoute);

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
