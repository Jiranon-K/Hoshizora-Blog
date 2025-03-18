'use client';

import React from 'react';

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
    <div className="fixed inset-0 bg-neutral/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
        </h3>
        
        <form onSubmit={onSubmit}>
          {/* ชื่อหมวดหมู่ */}
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">ชื่อหมวดหมู่</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={onChange}
              className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
              placeholder="กรอกชื่อหมวดหมู่"
            />
            {formErrors.name && <p className="text-error text-xs mt-1">{formErrors.name}</p>}
          </div>
          
          {/* Slug */}
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text">Slug (สำหรับ URL)</span>
            </label>
            <input 
              type="text" 
              name="slug"
              value={formData.slug} 
              onChange={onChange}
              className={`input input-bordered w-full ${formErrors.slug ? 'input-error' : ''}`}
              placeholder="slug-for-url"
            />
            {formErrors.slug && <p className="text-error text-xs mt-1">{formErrors.slug}</p>}
            <p className="text-xs text-gray-500 mt-1">
              ใช้สำหรับ URL เช่น yourdomain.com/blog?category={formData.slug || 'your-slug'}
            </p>
          </div>
          
          {/* ปุ่มดำเนินการ */}
          <div className="flex justify-end gap-2 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost"
              disabled={submitting}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  กำลังบันทึก...
                </>
              ) : isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มหมวดหมู่'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;