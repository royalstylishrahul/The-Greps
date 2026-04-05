const twilio = require("twilio");

// ── Twilio Client ──────────────────────────────────────────────────────────
let twilioClient = null;
function getTwilioClient() {
  if (!twilioClient) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return twilioClient;
}

// ── Format phone for WhatsApp ──────────────────────────────────────────────
// Expects Indian numbers like "9810012345" or "+919810012345"
function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  // If already has country code
  if (digits.length === 12 && digits.startsWith("91")) return `whatsapp:+${digits}`;
  // Indian 10-digit
  if (digits.length === 10) return `whatsapp:+91${digits}`;
  return `whatsapp:+${digits}`;
}

// ── Send via Twilio WhatsApp ───────────────────────────────────────────────
async function sendViaTwilio({ to, message, mediaUrl }) {
  const client = getTwilioClient();
  const from = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

  const payload = {
    from,
    to: formatPhone(to),
    body: message,
  };
  if (mediaUrl) payload.mediaUrl = [mediaUrl];

  const result = await client.messages.create(payload);
  return { sid: result.sid, status: result.status };
}

// ── Send via WATI ──────────────────────────────────────────────────────────
// WATI is popular in India — cheaper than Twilio for bulk WhatsApp
async function sendViaWATI({ to, message }) {
  const axios = require("axios");
  const endpoint = process.env.WATI_API_ENDPOINT;
  const token    = process.env.WATI_API_TOKEN;

  if (!endpoint || !token) throw new Error("WATI credentials not configured.");

  const digits = to.replace(/\D/g, "");
  const waNumber = digits.length === 10 ? `91${digits}` : digits;

  const response = await axios.post(
    `${endpoint}/api/v1/sendSessionMessage/${waNumber}`,
    { messageText: message },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// ── Main send function ─────────────────────────────────────────────────────
// Tries Twilio first; falls back to WATI if configured
async function sendWhatsAppMessage({ to, message, mediaUrl }) {
  const useWATI = process.env.WATI_API_TOKEN && !process.env.TWILIO_ACCOUNT_SID;

  if (useWATI) return sendViaWATI({ to, message });
  return sendViaTwilio({ to, message, mediaUrl });
}

module.exports = { sendWhatsAppMessage, formatPhone };
