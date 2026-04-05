const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    phone:{
type:String,
required:true
},
    name: String,
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    errorMessage: String,
    sentAt: Date,
  },
  { _id: false }
);

const campaignSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Snapshot of the product at time of campaign
    productSnapshot: {
      name: String,
      category: String,
      price: Number,
      offerPrice: Number,
    },
    // Filters applied
    filters: {
      locations: [String],
      genders: [String],
      categories: [String],
      recencyMonths: Number, // null = all time
    },
    message: {
      type: String,
      required: true,
    },
    recipients: [recipientSchema],
    totalCustomers: { type: Number, default: 0 },
    sentCount:      { type: Number, default: 0 },
    failedCount:    { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "sending", "sent", "failed"],
      default: "draft",
    },
    sentAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
