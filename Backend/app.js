require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

// Routes
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const broadcastRoutes = require("./routes/broadcast.routes");
const campaignRoutes = require("./routes/campaign.routes");
const otpRoutes = require("./routes/otp.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/broadcast", broadcastRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// health
app.get("/", (req, res) => {
  res.json({ status: "API Running" });
});

// error
app.use(errorHandler);

module.exports = app;