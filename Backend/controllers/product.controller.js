const Product = require("../models/product.model");

// ── GET /api/products ──────────────────────────────────────────────────────
exports.getProducts = async (req, res) => {
  try {
    let filter;

if(req.store.role==="admin"){

filter = { isActive:true };

}else{

filter = {
store:req.store._id,
isActive:true
};

}
    if (req.query.category) filter.category = req.query.category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/products/:id ──────────────────────────────────────────────────
exports.getProduct = async (req, res) => {
  try {
    let product;

if(req.store.role==="admin"){

product = await Product.findById(req.params.id);

}else{

product = await Product.findOne({
_id:req.params.id,
store:req.store._id
});

}
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/products ─────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, store: req.store._id });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/products/:id ──────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, store: req.store._id },
      { ...req.body, store: req.store._id },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/products/:id ───────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    // Soft delete
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, store: req.store._id },
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, message: "Product deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
