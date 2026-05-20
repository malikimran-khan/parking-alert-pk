// src/components/Loader.jsx
import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="w-10 h-10 border-2 border-dark-500 border-t-brand-500 rounded-full animate-spin" />
    <p className="text-gray-500 font-body text-sm">{text}</p>
  </div>
);

export default Loader;