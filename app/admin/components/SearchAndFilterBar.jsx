import React from 'react';

export default function SearchAndFilterBar({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  categoryFilter, 
  setCategoryFilter, 
  categories 
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="form-control w-full md:w-1/3">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="ค้นหาบทความ..." 
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-control w-full md:w-1/4">
        <select 
          className="select select-bordered w-full"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">สถานะทั้งหมด</option>
          <option value="published">เผยแพร่แล้ว</option>
          <option value="draft">ฉบับร่าง</option>
          <option value="archived">เก็บถาวร</option>
        </select>
      </div>
      
      <div className="form-control w-full md:w-1/4">
        <select 
          className="select select-bordered w-full"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">หมวดหมู่ทั้งหมด</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}