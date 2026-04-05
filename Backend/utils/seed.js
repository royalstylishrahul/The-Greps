require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const connectDB = require("../../config/db");

const Store    = require("../models/store.model");
const Customer = require("../models/customer.model");
const Product  = require("../models/product.model");
const Campaign = require("../models/campaign.model");

const seed = async () => {
  await connectDB();
  console.log("🌱 Seeding database…");

  // Wipe existing data
  await Promise.all([
    Store.deleteMany({}),
    Customer.deleteMany({}),
    Product.deleteMany({}),
    Campaign.deleteMany({}),
  ]);

  // ── Create store / owner account ─────────────────────────────────────────
  const store = await Store.create({
    storeName: "Sharma Fashion House",
    ownerName: "Rajesh Sharma",
    email:     "rajesh@sharmafashion.com",
    password:  "password123",
    phone:     "9810012345",
    location:  "Laxmi Nagar, Delhi",
  });
  console.log(`✅ Store created — login: rajesh@sharmafashion.com / password123`);

  // ── Create customers ──────────────────────────────────────────────────────
  const customers = await Customer.insertMany([
    { store: store._id, name: "Priya Sharma",   phone: "9810011111", location: "Laxmi Nagar", gender: "Female", category: "Kurti",   lastPurchaseDate: new Date("2024-12-10") },
    { store: store._id, name: "Anjali Mehta",   phone: "9899922222", location: "Dwarka",       gender: "Female", category: "Saree",   lastPurchaseDate: new Date("2024-11-22") },
    { store: store._id, name: "Rohit Kumar",    phone: "9711133333", location: "Laxmi Nagar", gender: "Male",   category: "Kurta",   lastPurchaseDate: new Date("2025-01-05") },
    { store: store._id, name: "Sunita Verma",   phone: "9650044444", location: "Janakpuri",   gender: "Female", category: "Kurti",   lastPurchaseDate: new Date("2024-10-15") },
    { store: store._id, name: "Meena Gupta",    phone: "9312255555", location: "Laxmi Nagar", gender: "Female", category: "Lehenga", lastPurchaseDate: new Date("2025-02-01") },
    { store: store._id, name: "Ramesh Patel",   phone: "9845066666", location: "Mayur Vihar", gender: "Male",   category: "Shirt",   lastPurchaseDate: new Date("2024-09-20") },
    { store: store._id, name: "Kavita Singh",   phone: "9999077777", location: "Rohini",       gender: "Female", category: "Kurti",   lastPurchaseDate: new Date("2025-01-18") },
    { store: store._id, name: "Deepa Yadav",    phone: "8800088888", location: "Dwarka",       gender: "Female", category: "Saree",   lastPurchaseDate: new Date("2024-12-25") },
    { store: store._id, name: "Amit Joshi",     phone: "7700099999", location: "Saket",        gender: "Male",   category: "Kurta",   lastPurchaseDate: new Date("2024-08-30") },
    { store: store._id, name: "Pooja Agarwal",  phone: "9988010101", location: "Laxmi Nagar", gender: "Female", category: "Lehenga", lastPurchaseDate: new Date("2025-02-14") },
  ]);
  console.log(`✅ ${customers.length} customers created`);

  // ── Create products ───────────────────────────────────────────────────────
  const products = await Product.insertMany([
    { store: store._id, name: "Floral Kurti",        category: "Kurti",   price: 1299, offerPrice: 999,  description: "Beautiful cotton floral kurti, perfect for summer.",         imageUrl: "🌸" },
    { store: store._id, name: "Silk Banarasi Saree", category: "Saree",   price: 3999, offerPrice: 2999, description: "Elegant Banarasi silk saree with golden border.",              imageUrl: "🥻" },
    { store: store._id, name: "Embroidered Lehenga", category: "Lehenga", price: 5999, offerPrice: 4499, description: "Wedding season special embroidered lehenga set.",              imageUrl: "👗" },
    { store: store._id, name: "Linen Kurta",         category: "Kurta",   price: 899,  offerPrice: 699,  description: "Comfortable linen kurta for men. Available in 5 colours.",    imageUrl: "👔" },
  ]);
  console.log(`✅ ${products.length} products created`);

  // ── Create a sample campaign ──────────────────────────────────────────────
  const kurti   = products[0];
  const targets  = customers.filter(c => c.category === "Kurti");
  await Campaign.create({
    store:    store._id,
    name:     "Summer Kurti Launch",
    product:  kurti._id,
    productSnapshot: { name: kurti.name, category: kurti.category, price: kurti.price, offerPrice: kurti.offerPrice },
    filters:  { locations: ["Laxmi Nagar"], genders: ["Female"], categories: ["Kurti"], recencyMonths: 6 },
    message:  `Namaskar! 🙏\n\n✨ *New Floral Kurti available* ✨\nOffer: ₹999 (MRP ₹1299)\n\nLimited stock!\n\nReply *BOOK* to reserve.`,
    recipients: targets.map(c => ({ customer: c._id, phone: c.phone, name: c.name, status: "sent", sentAt: new Date() })),
    totalCustomers: targets.length,
    sentCount:      targets.length,
    failedCount:    0,
    status: "sent",
    sentAt: new Date("2025-02-14"),
  });
  console.log(`✅ 1 sample campaign created`);

  console.log("\n🎉 Seed complete! You can now run: npm run dev");
  process.exit(0);
};

seed().catch(err => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
