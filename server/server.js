// server/server.js
require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");

const { initFirebase }  = require("./config/firebase");
const vehicleRoutes     = require("./routes/vehicleRoutes");
const healthRoutes      = require("./routes/healthRoutes");

// ── Init Firebase Admin ──────────────────────────────────
initFirebase();

// ── App Setup ────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security Middleware ───────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting (100 requests per 15 min per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter limit for form submissions (20 per 15 min)
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many submissions. Please wait before submitting again." },
});

// ── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ── Routes ────────────────────────────────────────────────
app.use("/api/health",   healthRoutes);
app.use("/api/vehicles", submitLimiter, vehicleRoutes);

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ── Start Server ──────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚗 Parking Alert PK Server`);
  console.log(`✅ Running on: http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;