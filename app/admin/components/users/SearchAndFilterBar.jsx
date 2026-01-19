'use client';

import React from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const SearchAndFilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  roleFilter, 
  setRoleFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-zinc-950/50 border border-zinc-900">
      <div className="w-full md:w-1/2">
        <div className="relative">
          <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full bg-transparent border-b border-zinc-800 py-2 pl-8 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="w-full md:w-1/4">
        <div className="relative">
          <FiFilter className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-500" />
          <select 
            className="w-full bg-transparent border-b border-zinc-800 py-2 pl-8 text-sm text-zinc-400 focus:outline-none focus:border-white transition-colors cursor-pointer appearance-none"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all" className="bg-black text-zinc-400">All Roles</option>
            <option value="admin" className="bg-black text-white">Admin</option>
            <option value="author" className="bg-black text-zinc-400">Author</option>
            <option value="editor" className="bg-black text-zinc-400">Editor</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;