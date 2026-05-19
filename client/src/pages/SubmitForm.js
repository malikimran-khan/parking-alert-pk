// src/pages/SubmitForm.js
import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { validateVehicleForm } from "../utils/validators";
import FormInput from "../components/FormInput";

const COLORS = ["White", "Black", "Silver", "Red", "Blue", "Green", "Yellow", "Grey", "Brown", "Other"];

const initialState = {
  vehicleName: "",
  vehicleNumber: "",
  ownerName: "",
  phoneNumber: "",
  vehicleColor: "",
};

const SubmitForm = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateVehicleForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "vehicles"), {
        ...form,
        vehicleNumber: form.vehicleNumber.toUpperCase(),
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setForm(initialState);
      setErrors({});
    } catch (err) {
      setErrors({ general: "Submission failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-emerald-500/30 rounded-3xl p-10 max-w-md w-full text-center animate-slide-up shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>
          <h2 className="text-white font-display font-bold text-2xl mb-3">Submitted!</h2>
          <p className="text-gray-400 font-body text-sm mb-8 leading-relaxed">
            Your vehicle information has been recorded successfully. The admin has been notified.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-xl font-body 
                       font-medium transition-all duration-200 hover:scale-105"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 
                          rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow"></span>
            <span className="text-brand-400 text-xs font-body font-medium tracking-widest uppercase">
              Vehicle Registration
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold font-display">
              P
            </div>
            <h1 className="text-white font-display font-extrabold text-3xl">Parking Alert PK</h1>
          </div>
          <p className="text-gray-400 font-body text-sm leading-relaxed max-w-sm mx-auto">
            Submit your vehicle details to register for parking alerts. All fields are required.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 shadow-2xl animate-slide-up">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6 text-red-400 text-sm font-body">
              ⚠ {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormInput
              label="Vehicle Name"
              name="vehicleName"
              value={form.vehicleName}
              onChange={handleChange}
              error={errors.vehicleName}
              placeholder="e.g. Toyota Corolla"
              icon="🚗"
            />

            <FormInput
              label="Vehicle Number"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              error={errors.vehicleNumber}
              placeholder="e.g. AQW 1455"
              icon="🔢"
            />

            <FormInput
              label="Owner Name"
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              error={errors.ownerName}
              placeholder="Full name of vehicle owner"
              icon="👤"
            />

            <FormInput
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              placeholder="03001234567"
              type="tel"
              icon="📱"
            />

            {/* Vehicle Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300 font-body tracking-wide">
                Vehicle Color <span className="text-brand-500">*</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, vehicleColor: color }));
                      if (errors.vehicleColor) setErrors((prev) => ({ ...prev, vehicleColor: "" }));
                    }}
                    className={`py-2 px-1 rounded-lg text-xs font-body border transition-all duration-200
                      ${form.vehicleColor === color
                        ? "bg-brand-500/20 border-brand-500 text-brand-300"
                        : "bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
              {errors.vehicleColor && (
                <p className="text-xs text-red-400 font-body flex items-center gap-1">
                  <span>⚠</span> {errors.vehicleColor}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 
                         text-white py-3.5 rounded-xl font-display font-semibold text-sm 
                         transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                         disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Vehicle Info →"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs font-body mt-6">
          Admin? <a href="/admin/login" className="text-brand-500 hover:text-brand-400 transition-colors">Sign in here</a>
        </p>
      </div>
    </div>
  );
};

export default SubmitForm;