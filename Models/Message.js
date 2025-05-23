const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["sent", "draft"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
