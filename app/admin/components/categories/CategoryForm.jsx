'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';

const CategoryForm = ({ 
  isOpen, 
  onClose, 
  formData, 
  formErrors, 
  onChange, 
  onSubmit, 
  submitting,
  isEditing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-900 rounded-none shadow-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-xl font-light text-white mb-8 tracking-tight">
          {isEditing ? 'EDIT CATEGORY' : 'NEW CATEGORY'}
        </h3>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* ชื่อหมวดหมู่ */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
              Category Name
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={onChange}
              className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${formErrors.name ? 'border-red-500' : ''}`}
              placeholder="Enter category name..."
            />
            {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
          </div>
          
          {/* Slug */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
              Slug (URL)
            </label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug} 
              onChange={onChange}
              className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 font-mono ${formErrors.slug ? 'border-red-500' : ''}`}
              placeholder="category-slug"
            />
            {formErrors.slug && <p className="text-red-400 text-xs mt-1">{formErrors.slug}</p>}
            <p className="text-[10px] text-zinc-600 mt-1 font-mono">
              .../blog?category={formData.slug || 'slug'}
            </p>
          </div>
          
          {/* ปุ่มดำเนินการ */}
          <div className="flex gap-4 mt-8 pt-4 border-t border-zinc-900">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;