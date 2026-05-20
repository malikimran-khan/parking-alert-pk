// server/routes/healthRoutes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Parking Alert PK API is running 🚗",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

module.exports = router;