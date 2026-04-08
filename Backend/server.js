require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const serverless = require("serverless-http");

// DB & Routes Import
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const broadcastRoutes = require("./routes/broadcast.routes");
const campaignRoutes = require("./routes/campaign.routes");
const otpRoutes = require("./routes/otp.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const adminRoutes = require("./routes/admin.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// 1. SECURITY & OPTIMIZATION MIDDLEWARES
app.use(helmet()); // Helmet ko start mein rakhein
app.use(compression());
app.use(morgan("dev"));

// 2. CORS CONFIGURATION
const allowedOrigins = [
    "https://main.d1jv16iunam0qq.amplifyapp.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "storeId", "storeid"],
    optionsSuccessStatus: 200
}));

// 3. BODY PARSERS
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. RATE LIMITER
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter); // Sirf API routes par limit lagayein

// 5. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/broadcast", broadcastRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({ status: "API Running", timestamp: new Date() });
});

// 6. 404 & ERROR HANDLING
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use(errorHandler);

// 7. DB CONNECTION & LAMBDA HANDLER
let isDBConnected = false;

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    // Lambda ko event loop khali hone ka wait nahi karne dena chahiye
    context.callbackWaitsForEmptyEventLoop = false;

    if (!isDBConnected) {
        try {
            await connectDB();
            isDBConnected = true;
            console.log("Database connected successfully");
        } catch (error) {
            console.error("DB Connection Error:", error);
            // Agar DB connect nahi hua toh request fail kar dein
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Database connection failed" })
            };
        }
    }

    return await handler(event, context);
};