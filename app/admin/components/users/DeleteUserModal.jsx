'use client';

import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const DeleteUserModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  isDeleting,
  errorMessage,
  userName
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-zinc-950 border border-zinc-900 shadow-2xl max-w-md w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-red-900/20 rounded-full border border-red-900/50">
                <FiAlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
                <h3 className="text-lg font-light text-white mb-2">Delete User?</h3>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    Are you sure you want to delete user "{userName}"? This action cannot be undone.
                </p>
            </div>
        </div>
        
        {errorMessage && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-300 text-sm px-4 py-3 mb-6">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-2">
          <button 
            className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : 'Delete User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;