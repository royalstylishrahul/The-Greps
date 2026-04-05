const Campaign  = require("../models/campaign.model");
const Customer  = require("../models/customer.model");
const Product   = require("../models/product.model");
const { sendWhatsAppMessage } = require("../utils/whatsapp.service");

// ── Helper: build customer filter from campaign filters ────────────────────
function buildCustomerFilter(storeId, filters = {}) {
  const q = { store: storeId };
  if (filters.locations?.length)  q.location = { $in: filters.locations };
  if (filters.genders?.length)    q.gender   = { $in: filters.genders };
  if (filters.categories?.length) q.category = { $in: filters.categories };
  if (filters.recencyMonths) {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - filters.recencyMonths);
    q.lastPurchaseDate = { $gte: cutoff };
  }
  return q;
}

// ── Helper: generate WhatsApp message ─────────────────────────────────────
function generateMessage(product) {
  return `Namaskar! 🙏

✨ *New ${product.name} available* ✨
Category: ${product.category}
MRP: ₹${product.price}  ➡️  Offer: ₹${product.offerPrice || product.price}

${product.description || ""}

🔥 Limited stock — hurry!
Visit our store today.

📲 Reply *BOOK* to reserve yours.`.trim();
}

// ── GET /api/campaigns ─────────────────────────────────────────────────────
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ store: req.store._id })
      .populate("product", "name category imageUrl")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: campaigns.length, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/campaigns/:id ─────────────────────────────────────────────────
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, store: req.store._id })
      .populate("product");
    if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found." });
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/campaigns/preview ────────────────────────────────────────────
// Returns matched customers + auto-generated message before creating campaign
exports.previewCampaign = async (req, res) => {
  try {
    const { productId, filters } = req.body;

    const product = await Product.findOne({ _id: productId, store: req.store._id });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    const customerFilter = buildCustomerFilter(req.store._id, filters);
    const [count, sample] = await Promise.all([
      Customer.countDocuments(customerFilter),
      Customer.find(customerFilter).limit(5).select("name whatsapp location gender category store"),
    ]);

    const message = generateMessage(product);

    res.json({ success: true, customerCount: count, sampleCustomers: sample, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/campaigns ────────────────────────────────────────────────────
// Creates campaign and sends messages immediately
exports.createAndSend = async (req, res) => {
  try {
    const { name, productId, filters, message: customMessage } = req.body;

    // Validate product
  const product = await Product.findOne({ _id: productId, store: req.store._id });

if (!product) {
return res.status(404).json({
success:false,
message:"Product not found"
});
}

    // Find matching customers
    const customerFilter = buildCustomerFilter(req.store._id, filters);
    const customers = await Customer.find({
...customerFilter,
whatsapp:{ $exists:true, $ne:null, $ne:"" }
}).select("name whatsapp");

    if (customers.length === 0)
      return res.status(400).json({ success: false, message: "No customers match your filters." });

    const message = customMessage || "Campaign message";

    // Build recipient list
    const recipients = customers.map(c => ({
  customer: c._id,
  phone:    c.whatsapp,
  name:     c.name,
  status:   "pending",
}));

    // Create campaign record
    const campaign = await Campaign.create({
      store:           req.store._id,
      name:            name || `${product.name} — ${new Date().toLocaleDateString("en-IN")}`,
      product:         product._id,
      productSnapshot: { name: product.name, category: product.category, price: product.price, offerPrice: product.offerPrice },
      filters,
      message,
      recipients,
      totalCustomers: customers.length,
      status: "sending",
    });

    // Respond immediately — send messages in background
    res.status(201).json({
      success: true,
      message: `Campaign created. Sending to ${customers.length} customers…`,
      campaign: { _id: campaign._id, name: campaign.name, totalCustomers: campaign.totalCustomers },
    });

    // ── Background send ────────────────────────────────────────────────────
    let sentCount = 0;
    let failedCount = 0;

    for (const recipient of recipients) {
      try {
        await sendWhatsAppMessage({
          to:      recipient.phone,
          message,
          mediaUrl: product.imageUrl?.startsWith("http") ? product.imageUrl : null,
        });
        recipient.status = "sent";
        recipient.sentAt = new Date();
        sentCount++;
      } catch (err) {
        recipient.status = "failed";
        recipient.errorMessage = err.message;
        failedCount++;
        console.error(`❌ Failed to send to ${recipient.phone}: ${err.message}`);
      }

      // Throttle: 1 msg per 100ms to avoid rate limits
      await new Promise(r => setTimeout(r, 50));
    }

    // Update campaign with final counts
    await Campaign.findByIdAndUpdate(campaign._id, {
      recipients,
      sentCount,
      failedCount,
      status: failedCount === recipients.length ? "failed" : "sent",
      sentAt: new Date(),
    });

    console.log(`✅ Campaign "${campaign.name}" done. Sent: ${sentCount}, Failed: ${failedCount}`);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/campaigns/:id ──────────────────────────────────────────────
exports.deleteCampaign = async (req, res) => {
  try {
    await Campaign.findOneAndDelete({ _id: req.params.id, store: req.store._id });
    res.json({ success: true, message: "Campaign deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
