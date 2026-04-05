const Campaign = require("../models/campaign.model");

// ── POST /api/whatsapp/webhook ─────────────────────────────────────────────
// Twilio sends incoming WhatsApp messages here
// When a customer replies "BOOK", we log it
exports.twilioWebhook = async (req, res) => {
  try {
    const { From, Body } = req.body;
    const text = (Body || "").trim().toUpperCase();
    const phone = (From || "").replace("whatsapp:+91", "").replace("whatsapp:+", "").replace("+91", "");

    console.log(`📩 Incoming WhatsApp from ${phone}: "${Body}"`);

    if (text === "BOOK") {
      // Find the most recent campaign that included this customer
      const campaign = await Campaign.findOne({
        "recipients.phone": phone,
        status: "sent",
      }).sort({ sentAt: -1 });

      if (campaign) {
        // Mark as replied
        await Campaign.updateOne(
          { _id: campaign._id, "recipients.phone": phone },
          { $set: { "recipients.$.status": "replied" } }
        );
        console.log(`✅ BOOK reply recorded for ${phone} on campaign "${campaign.name}"`);
      }
    }

    // Twilio expects TwiML response (even if empty)
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }
};

// ── POST /api/whatsapp/test ────────────────────────────────────────────────
// Send a test message to a single number (for setup verification)
exports.sendTest = async (req, res) => {
  const { sendWhatsAppMessage } = require("../utils/whatsapp.service");
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ success: false, message: "Phone number required." });

  try {
    await sendWhatsAppMessage({
      to: phone,
      message: "✅ StockAlert CRM test message. Your WhatsApp integration is working! 🎉",
    });
    res.json({ success: true, message: `Test message sent to ${phone}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
