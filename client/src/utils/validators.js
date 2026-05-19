// src/utils/validators.js

export const validateVehicleForm = (data) => {
  const errors = {};

  if (!data.vehicleName?.trim()) errors.vehicleName = "Vehicle name is required";
  else if (data.vehicleName.trim().length < 2) errors.vehicleName = "Must be at least 2 characters";

  if (!data.vehicleNumber?.trim()) errors.vehicleNumber = "Vehicle number is required";
  else if (!/^[A-Z]{2,3}\s?\d{3,4}$/i.test(data.vehicleNumber.trim()))
    errors.vehicleNumber = "Format: ABC 1234 or AB 123";

  if (!data.ownerName?.trim()) errors.ownerName = "Owner name is required";
  else if (data.ownerName.trim().length < 2) errors.ownerName = "Must be at least 2 characters";

  if (!data.phoneNumber?.trim()) errors.phoneNumber = "Phone number is required";
  else if (!/^(\+92|0)[0-9]{10}$/.test(data.phoneNumber.replace(/\s/g, "")))
    errors.phoneNumber = "Enter valid PK number (03001234567)";

  if (!data.vehicleColor?.trim()) errors.vehicleColor = "Vehicle color is required";

  return errors;
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "—";
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("en-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};