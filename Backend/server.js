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
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
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
const BASE_PATH = "/greps-backend";

app.use(BASE_PATH + "/api/auth", authRoutes);
app.use(BASE_PATH + "/api/admin", adminRoutes);
app.use(BASE_PATH + "/api/otp", otpRoutes);
app.use(BASE_PATH + "/api/customers", customerRoutes);
app.use(BASE_PATH + "/api/broadcast", broadcastRoutes);
app.use(BASE_PATH + "/api/campaigns", campaignRoutes);
app.use(BASE_PATH + "/api/whatsapp", whatsappRoutes);   

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
    // ✅ HANDLE PREFLIGHT (CORS) BEFORE ANYTHING ELSE
if (event.httpMethod === "OPTIONS") {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": event.headers.origin || "http://localhost:5173",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "Content-Type, Authorization, storeId, storeid",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: ""
    };
}
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

    const response = await handler(event, context);

return {
    ...response,
    headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": event.headers.origin || "http://localhost:5173",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "Content-Type, Authorization, storeId, storeid",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }
};
};
// ✅ LOCAL SERVER SUPPORT (IMPORTANT)

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
}