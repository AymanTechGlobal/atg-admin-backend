const Message = require("../Models/Message");
const nodemailer = require("nodemailer");

// Business email configuration
const BUSINESS_EMAIL = "akindukodithuwakku@gmail.com";

// Configure nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: BUSINESS_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD, // Use an app password, not your real password
  },
});

// Verify transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log("Email transporter verified successfully");
    return true;
  } catch (error) {
    console.error("Email transporter verification failed:", error);
    return false;
  }
};

// Send a message (email + save as sent)
const sendMessage = async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "To, subject, and body are required",
      });
    }

    // Verify email transporter
    const isTransporterValid = await verifyTransporter();
    if (!isTransporterValid) {
      return res.status(500).json({
        success: false,
        error: "Email service is not configured properly",
      });
    }

    // Create professional HTML email template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #09D1C7; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">ATG Healthcare</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Professional Communication</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h3 style="color: #333; margin-bottom: 15px;">${subject}</h3>
          <div style="background-color: white; padding: 20px; border-radius: 5px; line-height: 1.6; color: #333;">
            ${body.replace(/\n/g, "<br>")}
          </div>
        </div>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">This is an automated message from ATG Healthcare Admin System</p>
          <p style="margin: 5px 0 0 0;">Sent on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: `"ATG Healthcare Admin" <${BUSINESS_EMAIL}>`,
      to: to,
      subject: `[ATG Healthcare] ${subject}`,
      text: body, // Plain text version
      html: htmlContent, // HTML version
    };

    const emailResult = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", emailResult.messageId);

    // Save to DB as sent
    const message = await Message.create({
      from: BUSINESS_EMAIL,
      to: to.toLowerCase(),
      subject: subject,
      body: body,
      status: "sent",
      messageId: emailResult.messageId, // Store the email message ID for tracking
    });

    res.status(201).json({
      success: true,
      data: message,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending message:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to send message";
    if (error.code === "EAUTH") {
      errorMessage =
        "Email authentication failed. Please check email configuration.";
    } else if (error.code === "ECONNECTION") {
      errorMessage = "Unable to connect to email service.";
    } else if (error.code === "EENVELOPE") {
      errorMessage = "Invalid email address format.";
    }

    res.status(500).json({
      success: false,
      error: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Save a draft
const saveDraft = async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validate required fields
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: "To, subject, and body are required",
      });
    }

    const draft = await Message.create({
      from: BUSINESS_EMAIL,
      to: to.toLowerCase(),
      subject: subject,
      body: body,
      status: "draft",
    });

    res.status(201).json({
      success: true,
      data: draft,
      message: "Draft saved successfully",
    });
  } catch (error) {
    console.error("Error saving draft:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save draft",
    });
  }
};

// Get messages (by status and user)
const getMessages = async (req, res) => {
  try {
    const { status, user } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (user) {
      filter.$or = [{ to: user.toLowerCase() }, { from: user.toLowerCase() }];
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v"); // Exclude version key

    res.status(200).json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch messages",
    });
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
    res.status(500).json({
      success: false,
      error: "Failed to fetch message",
    });
  }
};

// Get message statistics
const getMessageStats = async (req, res) => {
  try {
    const { user } = req.query;
    let filter = {};

    if (user) {
      filter.$or = [{ to: user.toLowerCase() }, { from: user.toLowerCase() }];
    }

    const stats = await Message.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object format
    const statsObject = {
      total: 0,
      sent: 0,
      draft: 0,
    };

    stats.forEach((stat) => {
      statsObject[stat._id] = stat.count;
      statsObject.total += stat.count;
    });

    res.status(200).json({
      success: true,
      data: statsObject,
    });
  } catch (error) {
    console.error("Error fetching message stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch message statistics",
    });
  }
};

module.exports = {
  sendMessage,
  saveDraft,
  getMessages,
  getMessageById,
  getMessageStats,
};
