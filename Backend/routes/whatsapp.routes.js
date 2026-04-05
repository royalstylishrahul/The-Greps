const express = require("express");
const router  = express.Router();
const { twilioWebhook, sendTest } = require("../controllers/whatsapp.controller");
const { protect } = require("../middleware/auth.middleware");

// Twilio calls this — no auth (Twilio signs requests differently)
// In production, add Twilio signature validation middleware here
router.post("/webhook", twilioWebhook);

// Test send — requires store auth
router.post("/test", protect, sendTest);

module.exports = router;
