'use client';

import React from 'react';

const CategoriesSelect = ({ categories, value, onChange }) => {
  return (
    <div className="form-control w-full">
      <label className="label px-0">
        <span className="label-text text-zinc-400 font-medium">หมวดหมู่</span>
      </label>
      <select 
        name="category_id"
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-zinc-900 border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-600 focus:ring-0 rounded-md"
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