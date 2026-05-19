// src/pages/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
    <div className="text-center animate-slide-up">
      <p className="text-8xl font-display font-extrabold text-dark-600 mb-4">404</p>
      <h1 className="text-white font-display font-bold text-2xl mb-2">Page Not Found</h1>
      <p className="text-gray-500 font-body text-sm mb-8">
        The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl 
                     font-body text-sm transition-all duration-200"
        >
          Submit Form
        </Link>
        <Link
          to="/admin/login"
          className="bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-300 
                     px-6 py-2.5 rounded-xl font-body text-sm transition-all duration-200"
        >
          Admin Login
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;