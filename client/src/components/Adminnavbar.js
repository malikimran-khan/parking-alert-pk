// src/components/AdminNavbar.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="bg-dark-800 border-b border-dark-600 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold font-display text-sm">
          P
        </div>
        <div>
          <h1 className="text-white font-display font-bold text-lg leading-none">Parking Alert PK</h1>
          <p className="text-gray-500 text-xs font-body">Admin Dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow"></div>
          <span className="text-gray-400 text-sm font-body truncate max-w-[180px]">{currentUser?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="bg-dark-700 hover:bg-red-500/20 border border-dark-500 hover:border-red-500/50 
                     text-gray-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm font-body 
                     transition-all duration-200 flex items-center gap-2"
        >
          <span>↗</span>
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;