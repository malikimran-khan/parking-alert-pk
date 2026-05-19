// src/components/StatsCard.js
import React from "react";

const StatsCard = ({ title, value, icon, color, subtitle }) => {
  const colorMap = {
    orange: "from-brand-500/20 to-brand-600/10 border-brand-500/30 text-brand-400",
    blue:   "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green:  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br border rounded-2xl p-5 animate-fade-in ${colorMap[color] || colorMap.orange}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 font-body uppercase tracking-widest mb-1">{title}</p>
          <p className="text-3xl font-bold text-white font-display">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 font-body mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
      <div className="absolute -bottom-4 -right-4 text-7xl opacity-5">{icon}</div>
    </div>
  );
};

export default StatsCard;