const Message = require("../Models/Message");
const nodemailer = require("nodemailer");

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "atghealthcare.admin@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD, // Use an app password, not your real password
  },
});

// Send a message (email + save as sent)
const sendMessage = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const from = "atghealthcare.admin@gmail.com";

    // Send email
    await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });

    // Save to DB as sent
    const message = await Message.create({
      from,
      to,
      subject,
      body,
      status: "sent",
    });
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

// Save a draft
const saveDraft = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const from = "atghealthcare.admin@gmail.com";
    const draft = await Message.create({
      from,
      to,
      subject,
      body,
      status: "draft",
    });
    res.status(201).json({ success: true, data: draft });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({ success: false, error: "Failed to save draft" });
  }
};

// Get messages (by status and user)
const getMessages = async (req, res) => {
  try {
    const { status, user } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (user) filter.$or = [{ to: user }, { from: user }];
    const messages = await Message.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

// Get a single message by ID
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, error: "Message not found" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ success: false, error: "Failed to fetch message" });
  }
};

module.exports = {
  sendMessage,
  saveDraft,
  getMessages,
  getMessageById,
};
