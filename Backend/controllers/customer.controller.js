const { parse } = require("csv-parse/sync");
const Customer = require("../models/customer.model");

// ── Helper: build filter query ─────────────────────────────────────────────
function buildFilterQuery(storeId, query) {
  const filter = { store: storeId };

  if (query.location)  filter.location = { $in: query.location.split(",").map(s => s.trim()) };
  if (query.gender)    filter.gender   = { $in: query.gender.split(",").map(s => s.trim()) };
  if (query.category)  filter.category = { $in: query.category.split(",").map(s => s.trim()) };

  if (query.recencyMonths) {
    const months = parseInt(query.recencyMonths);
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    filter.lastPurchaseDate = { $gte: cutoff };
  }

  if (query.search) {
    const re = new RegExp(query.search, "i");
    filter.$or = [{ name: re }, { whatsapp: re }, { location: re }];
  }

  return filter;
}

// ── GET /api/customers ─────────────────────────────────────────────────────
exports.getCustomers = async (req, res) => {
  try {
    let filter;

if(req.store.role==="admin"){

filter = {};

}else{

filter = buildFilterQuery(req.store._id, req.query);

}
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip  = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: customers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/customers/filter-count ───────────────────────────────────────
// Returns just the count for a given filter (used in campaign builder preview)
exports.getFilterCount = async (req, res) => {
  try {
    const filter = buildFilterQuery(req.store._id, req.query);
    const count = await Customer.countDocuments(filter);
    const sample = await Customer.find(filter).limit(5).select("name phone");
    res.json({ success: true, count, sample });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/customers/:id ─────────────────────────────────────────────────
exports.getCustomer = async (req, res) => {

try{

let customer;

if(req.store.role==="admin"){

customer = await Customer.findById(req.params.id);

}else{

customer = await Customer.findOne({
_id:req.params.id,
store:req.store._id
});

}

if(!customer){

return res.status(404).json({
success:false,
message:"Customer not found"
});

}

res.json({
success:true,
customer
});

}catch(err){

res.status(500).json({
success:false,
message:err.message
});

}

};

// ── POST /api/customers ────────────────────────────────────────────────────
exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({...req.body,store: req.body.store || req.store?._id});
    res.status(201).json({ success: true, customer });
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ success: false, message: "A customer with this phone number already exists." });
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/customers/:id ─────────────────────────────────────────────────
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, store: req.store._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/customers/:id ──────────────────────────────────────────────
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, store: req.store._id });
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, message: "Customer deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/customers/import-csv ────────────────────────────────────────
exports.importCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No CSV file uploaded." });

    const records = parse(req.file.buffer, {
      columns: true,         // use first row as keys
      skip_empty_lines: true,
      trim: true,
    });

    // Normalize CSV column names → model fields
    const FIELD_MAP = {
      name:         ["name", "customer name", "full name"],
      phone:        ["phone", "mobile", "whatsapp", "phone number", "mobile number"],
      location:     ["location", "area", "city"],
      gender:       ["gender", "sex"],
      category:     ["category", "category bought", "item", "product category"],
      lastPurchaseDate: ["last purchase", "last purchase date", "purchase date", "last_purchase"],
    };

    function mapRow(row) {
      const lowerRow = {};
      for (const k of Object.keys(row)) lowerRow[k.toLowerCase().trim()] = row[k];

      const mapped = { store: req.store._id };
      for (const [field, aliases] of Object.entries(FIELD_MAP)) {
        const alias = aliases.find(a => lowerRow[a] !== undefined);
        if (alias) mapped[field] = lowerRow[alias];
      }
      return mapped;
    }

    const docs = records.map(mapRow).filter(d => d.name && d.whatsapp);

    // Bulk upsert (update if phone exists, insert otherwise)
    const ops = docs.map(doc => ({
      updateOne: {
        filter: { store: req.store._id, whatsapp: doc.whatsapp },
        update: { $set: doc },
        upsert: true,
      },
    }));

    const result = await Customer.bulkWrite(ops);

    res.status(201).json({
      success: true,
      message: `Import complete. ${result.upsertedCount} added, ${result.modifiedCount} updated.`,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      skipped: records.length - docs.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
