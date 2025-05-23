const express = require("express");
const router = express.Router();
const {
  sendMessage,
  saveDraft,
  getMessages,
  getMessageById,
} = require("../Controllers/messageController");
const { protect } = require("../middleware/auth");

// Protect all routes
router.use(protect);

// Send a message
router.post("/send", sendMessage);
// Save a draft
router.post("/draft", saveDraft);
// Get all messages (optionally filter by status/user)
router.get("/", getMessages);
// Get a single message by id
router.get("/:id", getMessageById);

module.exports = router;
