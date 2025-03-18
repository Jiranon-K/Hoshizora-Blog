'use client';

import React from 'react';

const CategoriesSelect = ({ categories, value, onChange }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">หมวดหมู่</span>
      </label>
      <select 
        name="category_id"
        value={value}
        onChange={onChange}
        className="select select-bordered w-full"
      >
        <option value="">-- เลือกหมวดหมู่ --</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoriesSelect;