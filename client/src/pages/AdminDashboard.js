// src/pages/AdminDashboard.js
import React, { useState, useMemo } from "react";
import AdminNavbar from "../components/AdminNavbar";
import StatsCard from "../components/StatsCard";
import DeleteModal from "../components/DeleteModal";
import Loader from "../components/Loader";
import { useVehicles } from "../hooks/useVehicles";
import { formatDate } from "../utils/validators";

const COLOR_BADGE = {
  White:  "bg-gray-100/10 text-gray-300 border-gray-500/30",
  Black:  "bg-gray-900/50 text-gray-400 border-gray-600/30",
  Silver: "bg-slate-400/10 text-slate-300 border-slate-500/30",
  Red:    "bg-red-500/10 text-red-400 border-red-500/30",
  Blue:   "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Green:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  Yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  Grey:   "bg-gray-500/10 text-gray-400 border-gray-500/30",
  Brown:  "bg-amber-700/10 text-amber-600 border-amber-700/30",
  Other:  "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

const AdminDashboard = () => {
  const { vehicles, loading, error, deleteVehicle, refetch } = useVehicles();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.vehicleNumber?.toLowerCase().includes(q) ||
        v.ownerName?.toLowerCase().includes(q) ||
        v.phoneNumber?.toLowerCase().includes(q)
    );
  }, [vehicles, search]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVehicle(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // Stats
  const colorCounts = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => { map[v.vehicleColor] = (map[v.vehicleColor] || 0) + 1; });
    return map;
  }, [vehicles]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return vehicles.filter((v) => {
      const d = v.createdAt?.toDate ? v.createdAt.toDate() : new Date(v.createdAt);
      return d.toDateString() === today;
    }).length;
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-dark-900 font-body">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-display font-bold text-white">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor all vehicle submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Records"
            value={vehicles.length}
            icon="🚗"
            color="orange"
            subtitle="All time submissions"
          />
          <StatsCard
            title="Today"
            value={todayCount}
            icon="📅"
            color="blue"
            subtitle="Submitted today"
          />
          <StatsCard
            title="Search Results"
            value={filtered.length}
            icon="🔍"
            color="green"
            subtitle={search ? `Matching "${search}"` : "Showing all"}
          />
          <StatsCard
            title="Colors"
            value={Object.keys(colorCounts).length}
            icon="🎨"
            color="purple"
            subtitle="Unique vehicle colors"
          />
        </div>

        {/* Search & Table */}
        <div className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden shadow-xl animate-slide-up">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-dark-600">
            <div>
              <h3 className="text-white font-display font-semibold text-lg">Vehicle Records</h3>
              <p className="text-gray-500 text-xs mt-0.5">
                {filtered.length} of {vehicles.length} records
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by number, name, phone..."
                  className="w-full sm:w-72 bg-dark-700 border border-dark-500 rounded-xl 
                             pl-9 pr-4 py-2.5 text-white placeholder-dark-300 text-sm 
                             outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 
                             transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                onClick={refetch}
                className="bg-dark-700 border border-dark-500 hover:border-dark-400 text-gray-400 
                           hover:text-white px-3 py-2.5 rounded-xl transition-all text-sm"
                title="Refresh"
              >
                ↺
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <Loader text="Fetching vehicle records..." />
          ) : error ? (
            <div className="p-8 text-center text-red-400 font-body text-sm">
              ⚠ {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4">{search ? "🔍" : "📭"}</div>
              <p className="text-gray-400 font-body">
                {search ? `No results for "${search}"` : "No vehicle records yet"}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-brand-500 text-sm mt-2 hover:underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-dark-700/50 border-b border-dark-600">
                    {["#", "Vehicle Name", "Plate Number", "Owner", "Phone", "Color", "Submitted", "Action"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-gray-400 font-body font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <tr
                      key={v.id}
                      className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors group"
                    >
                      <td className="px-4 py-4 text-gray-600 font-body text-xs">{i + 1}</td>
                      <td className="px-4 py-4 text-white font-body font-medium whitespace-nowrap">{v.vehicleName}</td>
                      <td className="px-4 py-4">
                        <span className="bg-brand-500/15 border border-brand-500/30 text-brand-300 
                                         px-2.5 py-1 rounded-lg font-display font-semibold text-xs tracking-wider">
                          {v.vehicleNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-300 font-body whitespace-nowrap">{v.ownerName}</td>
                      <td className="px-4 py-4 text-gray-400 font-body whitespace-nowrap">{v.phoneNumber}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-lg border text-xs font-body 
                          ${COLOR_BADGE[v.vehicleColor] || COLOR_BADGE.Other}`}>
                          {v.vehicleColor}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 font-body text-xs whitespace-nowrap">
                        {formatDate(v.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setDeleteTarget(v)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 
                                     hover:border-red-500/40 text-red-400 px-3 py-1.5 rounded-lg 
                                     text-xs font-body transition-all duration-200 opacity-0 
                                     group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-dark-700/50 text-xs text-gray-600 font-body">
              Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
              {search ? ` matching "${search}"` : ""}
            </div>
          )}
        </div>
      </main>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          vehicle={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AdminDashboard;