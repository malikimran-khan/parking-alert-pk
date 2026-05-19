// src/pages/AdminLogin.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { db } from "../firebase/config";

const AdminLogin = () => {
  const { login, signup, currentUser } = useAuth();
  const navigate = useNavigate();

  const [isFirstTime, setIsFirstTime] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (currentUser) navigate("/admin/dashboard");
  }, [currentUser, navigate]);

  // Check if any admin has ever signed up (by checking a Firestore marker)
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const q = query(collection(db, "admin_config"), limit(1));
        const snap = await getDocs(q);
        setIsFirstTime(snap.empty);
      } catch {
        setIsFirstTime(false);
      } finally {
        setCheckingAdmin(false);
      }
    };
    checkAdminExists();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    if (isFirstTime && form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (isFirstTime) {
        await signup(form.email, form.password);
        // Mark admin as created
        const { addDoc } = await import("firebase/firestore");
        await addDoc(collection(db, "admin_config"), {
          createdAt: new Date().toISOString(),
          email: form.email,
        });
      } else {
        await login(form.email, form.password);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      const msg = err.code === "auth/user-not-found" || err.code === "auth/wrong-password"
        ? "Invalid email or password"
        : err.code === "auth/email-already-in-use"
        ? "Admin already exists. Please login."
        : "Authentication failed. Try again.";
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-dark-500 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500 rounded-2xl flex items-center justify-center 
                          text-white font-display font-extrabold text-2xl mx-auto mb-4 shadow-lg shadow-brand-500/30">
            P
          </div>
          <h1 className="text-white font-display font-extrabold text-2xl mb-1">
            {isFirstTime ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="text-gray-500 font-body text-sm">
            {isFirstTime
              ? "First time setup — create your admin account"
              : "Parking Alert PK — Admin Panel"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-600 rounded-3xl p-8 shadow-2xl">
          {isFirstTime && (
            <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl p-3 mb-6 text-brand-300 text-sm font-body">
              🎉 First time setup detected. Create your admin credentials.
            </div>
          )}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-6 text-red-400 text-sm font-body">
              ⚠ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-sm font-medium text-gray-300 font-body mb-1.5 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={`w-full bg-dark-700 border rounded-xl px-4 py-3 text-white 
                  placeholder-dark-300 font-body text-sm outline-none transition-all
                  focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
                  ${errors.email ? "border-red-500/70" : "border-dark-500 hover:border-dark-400"}`}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1 font-body">⚠ {errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 font-body mb-1.5 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-dark-700 border rounded-xl px-4 py-3 text-white 
                  placeholder-dark-300 font-body text-sm outline-none transition-all
                  focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
                  ${errors.password ? "border-red-500/70" : "border-dark-500 hover:border-dark-400"}`}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1 font-body">⚠ {errors.password}</p>}
            </div>

            {isFirstTime && (
              <div>
                <label className="text-sm font-medium text-gray-300 font-body mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full bg-dark-700 border rounded-xl px-4 py-3 text-white 
                    placeholder-dark-300 font-body text-sm outline-none transition-all
                    focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
                    ${errors.confirmPassword ? "border-red-500/70" : "border-dark-500 hover:border-dark-400"}`}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1 font-body">⚠ {errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white 
                         py-3.5 rounded-xl font-display font-semibold text-sm transition-all 
                         duration-200 hover:scale-[1.02] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isFirstTime ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                isFirstTime ? "Create Admin Account →" : "Sign In →"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs font-body mt-4">
          ← <a href="/" className="text-brand-500 hover:text-brand-400 transition-colors">Back to submit form</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;