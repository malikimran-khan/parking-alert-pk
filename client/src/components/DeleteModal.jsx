// src/components/DeleteModal.jsx
import React from "react";

const DeleteModal = ({ vehicle, onConfirm, onCancel, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-dark-800 border border-dark-500 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-slide-up">
        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
          🗑
        </div>
        <h3 className="text-white font-display font-bold text-xl mb-2">Delete Record</h3>
        <p className="text-gray-400 font-body text-sm mb-1">
          Are you sure you want to delete this vehicle record?
        </p>
        <div className="bg-dark-700 rounded-xl p-3 my-4 border border-dark-500">
          <p className="text-brand-400 font-display font-semibold">{vehicle?.vehicleNumber}</p>
          <p className="text-gray-400 text-sm font-body">{vehicle?.ownerName}</p>
        </div>
        <p className="text-red-400 text-xs font-body mb-5">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-dark-700 hover:bg-dark-600 border border-dark-500 text-gray-300
                       py-2.5 rounded-xl font-body text-sm transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl
                       font-body text-sm font-medium transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;