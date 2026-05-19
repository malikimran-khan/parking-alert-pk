// src/components/FormInput.js
import React from "react";

const FormInput = ({ label, name, value, onChange, error, placeholder, type = "text", icon }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300 font-body tracking-wide">
        {label} <span className="text-brand-500">*</span>
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-300 text-lg">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-dark-700 border rounded-xl px-4 py-3 text-white placeholder-dark-300
            font-body text-sm transition-all duration-200 outline-none
            focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500/70 bg-red-500/5" : "border-dark-500 hover:border-dark-400"}`}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 font-body flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;