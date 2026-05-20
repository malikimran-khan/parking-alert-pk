// server/routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getVehicles,
  getVehicleById,
  deleteVehicle,
  getStats,
} = require("../controllers/vehicleController");

const { verifyToken }     = require("../middleware/authMiddleware");
const { validateVehicle } = require("../middleware/validateVehicle");

// ─── Public Routes ────────────────────────────────────────
// Client form submission (no auth needed)
router.post("/", validateVehicle, createVehicle);

// ─── Protected Admin Routes ───────────────────────────────
router.use(verifyToken); // All routes below require Firebase auth token

router.get("/stats",  getStats);
router.get("/",       getVehicles);
router.get("/:id",    getVehicleById);
router.delete("/:id", deleteVehicle);

module.exports = router;