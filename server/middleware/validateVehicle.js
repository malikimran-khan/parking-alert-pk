// server/middleware/validateVehicle.js

const validateVehicle = (req, res, next) => {
  const { vehicleName, vehicleNumber, ownerName, phoneNumber, vehicleColor } = req.body;
  const errors = [];

  if (!vehicleName?.trim()) errors.push("vehicleName is required");
  if (!vehicleNumber?.trim()) errors.push("vehicleNumber is required");
  else if (!/^[A-Z]{2,3}\s?\d{3,4}$/i.test(vehicleNumber.trim()))
    errors.push("vehicleNumber format invalid (e.g. AQW 1455)");

  if (!ownerName?.trim()) errors.push("ownerName is required");

  if (!phoneNumber?.trim()) errors.push("phoneNumber is required");
  else if (!/^(\+92|0)[0-9]{10}$/.test(phoneNumber.replace(/\s/g, "")))
    errors.push("phoneNumber must be a valid Pakistani number");

  if (!vehicleColor?.trim()) errors.push("vehicleColor is required");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};

module.exports = { validateVehicle };