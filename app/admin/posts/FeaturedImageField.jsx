'use client';

import React from 'react';
import { getImageUrl } from '@/lib/helpers';

const FeaturedImageField = ({ value, onClick, errorMessage }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">ภาพปก</span>
      </label>
      <div className="flex items-center">
        <input 
          type="text" 
          name="featured_image"
          value={value}
          className="input input-bordered w-full mr-2"
          placeholder="URL ของภาพปก"
          readOnly
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={onClick}
        >
          เลือกรูปภาพ
        </button>
      </div>
      {errorMessage && <span className="text-error text-sm mt-1">{errorMessage}</span>}
      
      {value && (
        <div className="mt-2">
          <img 
            src={getImageUrl(value)} 
            alt="ภาพตัวอย่าง" 
            className="w-full max-w-xs rounded-md shadow-sm" 
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
              e.target.alt = 'ไม่สามารถโหลดภาพได้';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FeaturedImageField;