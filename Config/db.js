const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;
try {
  mongoose.connect(URI);
  console.log("Connected to database.");
} catch (err) {
  console.log(err);
}

const db = mongoose.connection.useDb("Admin");
module.exports = db;

//this is the database connection for the admin panel

