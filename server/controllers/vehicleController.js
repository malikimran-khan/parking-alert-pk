// server/controllers/vehicleController.js
const { getDb } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

const COLLECTION = "vehicles";

// POST /api/vehicles — public (client form)
const createVehicle = async (req, res) => {
  try {
    const { vehicleName, vehicleNumber, ownerName, phoneNumber, vehicleColor } = req.body;
    const db = getDb();

    const docRef = await db.collection(COLLECTION).add({
      vehicleName:   vehicleName.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      ownerName:     ownerName.trim(),
      phoneNumber:   phoneNumber.trim(),
      vehicleColor:  vehicleColor.trim(),
      createdAt:     FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      success: true,
      message: "Vehicle record created successfully",
      id: docRef.id,
    });
  } catch (err) {
    console.error("createVehicle error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/vehicles — admin only
const getVehicles = async (req, res) => {
  try {
    const db = getDb();
    const { search } = req.query;

    let snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .get();

    let vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || null,
    }));

    // Server-side search filter
    if (search?.trim()) {
      const q = search.toLowerCase();
      vehicles = vehicles.filter(
        (v) =>
          v.vehicleNumber?.toLowerCase().includes(q) ||
          v.ownerName?.toLowerCase().includes(q) ||
          v.phoneNumber?.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    console.error("getVehicles error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/vehicles/:id — admin only
const getVehicleById = async (req, res) => {
  try {
    const db = getDb();
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    return res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate()?.toISOString() },
    });
  } catch (err) {
    console.error("getVehicleById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/vehicles/:id — admin only
const deleteVehicle = async (req, res) => {
  try {
    const db = getDb();
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    await docRef.delete();

    return res.status(200).json({
      success: true,
      message: "Vehicle record deleted successfully",
    });
  } catch (err) {
    console.error("deleteVehicle error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/vehicles/stats — admin only
const getStats = async (req, res) => {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).get();

    const total = snapshot.size;
    const colorMap = {};
    let todayCount = 0;
    const today = new Date().toDateString();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const color = data.vehicleColor || "Other";
      colorMap[color] = (colorMap[color] || 0) + 1;

      const date = data.createdAt?.toDate();
      if (date && date.toDateString() === today) todayCount++;
    });

    return res.status(200).json({
      success: true,
      data: {
        total,
        todayCount,
        colorDistribution: colorMap,
      },
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createVehicle, getVehicles, getVehicleById, deleteVehicle, getStats };