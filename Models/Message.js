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
    messageId: {
      type: String,
      trim: true,
      // Only required for sent messages
      required: function () {
        return this.status === "sent";
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
messageSchema.index({ from: 1, to: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
