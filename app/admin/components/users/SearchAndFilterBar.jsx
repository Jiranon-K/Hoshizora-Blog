'use client';

import React from 'react';

const SearchAndFilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="form-control w-full md:w-1/2">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="ค้นหาผู้ใช้..." 
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="form-control w-full md:w-1/4">
        <select 
          className="select select-bordered w-full"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">สิทธิ์ทั้งหมด</option>
          <option value="admin">ผู้ดูแลระบบ</option>
          <option value="author">ผู้เขียน</option>
          <option value="editor">บรรณาธิการ</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;