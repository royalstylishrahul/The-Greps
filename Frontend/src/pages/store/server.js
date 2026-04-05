import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/stockalert");

// ─── Mongoose Schemas ──────────────────────────────────────────────────────

const customFieldSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },   // Multi-tenant isolation
  label: { type: String, required: true },
  fieldType: {
    type: String,
    enum: ["text", "dropdown", "datetime", "document"],
    required: true,
  },
  isMandatory: { type: Boolean, default: false },
  dropdownOptions: [{ type: String }],                       // For "dropdown" type
  uniqueMappingId: { type: String, unique: true, default: uuidv4 },
  createdAt: { type: Date, default: Date.now },
});

const uploadedDocumentSchema = new mongoose.Schema({
  storeId: { type: String, required: true, index: true },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "CustomField", required: true },
  uniqueMappingId: { type: String, required: true, index: true },
  customerId: { type: String },                              // Optional customer link
  fileUrl: { type: String, required: true },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const CustomField = mongoose.model("CustomField", customFieldSchema);
const UploadedDocument = mongoose.model("UploadedDocument", uploadedDocumentSchema);

// ─── Cloudinary Config ─────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "stockalert-docs",
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// ─── Routes ────────────────────────────────────────────────────────────────

// GET  /api/fields/:storeId          – list all fields for a store
app.get("/api/fields/:storeId", async (req, res) => {
  try {
    const fields = await CustomField.find({ storeId: req.params.storeId }).sort({ createdAt: -1 });
    res.json({ success: true, fields });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/fields/:storeId          – create a new custom field
app.post("/api/fields/:storeId", async (req, res) => {
  try {
    const { label, fieldType, isMandatory, dropdownOptions } = req.body;
    const uniqueMappingId = uuidv4();

    const field = await CustomField.create({
      storeId: req.params.storeId,
      label,
      fieldType,
      isMandatory,
      dropdownOptions: fieldType === "dropdown" ? dropdownOptions : [],
      uniqueMappingId,
    });

    let qrCodeDataUrl = null;

    if (fieldType === "document") {
      // Generate QR pointing to the upload portal
      const uploadUrl = `${process.env.FRONTEND_URL}/upload/${uniqueMappingId}`;
      qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#7C5CFC", light: "#FFFFFF" },
      });
    }

    res.json({ success: true, field, qrCodeDataUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/fields/:storeId/:fieldId – update a field
app.patch("/api/fields/:storeId/:fieldId", async (req, res) => {
  try {
    const field = await CustomField.findOneAndUpdate(
      { _id: req.params.fieldId, storeId: req.params.storeId }, // Tenant-isolated!
      { $set: req.body },
      { new: true }
    );
    if (!field) return res.status(404).json({ success: false, error: "Field not found" });
    res.json({ success: true, field });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/fields/:storeId/:fieldId
app.delete("/api/fields/:storeId/:fieldId", async (req, res) => {
  try {
    const result = await CustomField.findOneAndDelete({
      _id: req.params.fieldId,
      storeId: req.params.storeId, // Tenant-isolated!
    });
    if (!result) return res.status(404).json({ success: false, error: "Field not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/fields/qr/:uniqueMappingId – regenerate QR for a document field
app.get("/api/fields/qr/:uniqueMappingId", async (req, res) => {
  try {
    const field = await CustomField.findOne({
      uniqueMappingId: req.params.uniqueMappingId,
      fieldType: "document",
    });
    if (!field) return res.status(404).json({ success: false, error: "Field not found" });

    const uploadUrl = `${process.env.FRONTEND_URL}/upload/${req.params.uniqueMappingId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(uploadUrl, {
      width: 400,
      margin: 2,
      color: { dark: "#7C5CFC", light: "#FFFFFF" },
    });

    res.json({ success: true, qrCodeDataUrl, uploadUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/upload-portal/:uniqueMappingId – get field info for the upload page
app.get("/api/upload-portal/:uniqueMappingId", async (req, res) => {
  try {
    const field = await CustomField.findOne({
      uniqueMappingId: req.params.uniqueMappingId,
    });
    if (!field) return res.status(404).json({ success: false, error: "Invalid QR link" });
    res.json({
      success: true,
      fieldLabel: field.label,
      isMandatory: field.isMandatory,
      storeId: field.storeId,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload/:uniqueMappingId – upload a document via QR portal
app.post("/api/upload/:uniqueMappingId", upload.single("file"), async (req, res) => {
  try {
    const field = await CustomField.findOne({
      uniqueMappingId: req.params.uniqueMappingId,
    });
    if (!field) return res.status(404).json({ success: false, error: "Invalid upload link" });
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    const doc = await UploadedDocument.create({
      storeId: field.storeId,
      fieldId: field._id,
      uniqueMappingId: field.uniqueMappingId,
      customerId: req.body.customerId || null,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
    });

    res.json({ success: true, document: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/documents/:storeId – list all uploaded docs for a store
app.get("/api/documents/:storeId", async (req, res) => {
  try {
    const docs = await UploadedDocument.find({ storeId: req.params.storeId })
      .populate("fieldId", "label fieldType")
      .sort({ uploadedAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`StockAlert API running on port ${PORT}`));
