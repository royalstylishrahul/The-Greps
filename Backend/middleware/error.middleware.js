const errorHandler = (err, req, res, next) => {

    console.error("❌ ERROR:", err.stack);

    // ✅ ALWAYS set CORS headers (VERY IMPORTANT)
    res.setHeader(
        "Access-Control-Allow-Origin",
        req.headers.origin || "http://localhost:5173"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, storeId, storeid"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    // Multer Error
    if (err.name === "MulterError") {
        return res.status(400).json({
            success: false,
            message: "File upload error"
        });
    }

    // File type error
    if (err.message === "Only JPG PNG WEBP allowed") {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Default error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server error"
    });
};

module.exports = errorHandler;