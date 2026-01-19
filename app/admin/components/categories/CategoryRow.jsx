'use client';

import React from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

const CategoryRow = ({ category, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <tr className="hover:bg-zinc-900/50 transition-colors border-b border-zinc-800 text-sm">
      <td className="p-4 font-light text-white">{category.name}</td>
      <td className="p-4">
        <code className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded font-mono">{category.slug}</code>
      </td>
      <td className="p-4">
        <div className="badge bg-zinc-900 border-zinc-800 text-zinc-300 font-light rounded-sm">{category.post_count || 0}</div>
      </td>
      <td className="p-4 text-zinc-500 font-light">{formatDate(category.created_at)}</td>
      <td className="p-4">
        <div className="flex gap-2">
          <button 
            onClick={onEdit} 
            className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
            title="แก้ไข"
          >
            <FiEdit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 rounded-md hover:bg-red-900/20 text-zinc-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-900/50"
            disabled={category.post_count > 0}
            title={category.post_count > 0 ? 'ไม่สามารถลบได้เนื่องจากมีบทความที่ใช้หมวดหมู่นี้' : 'ลบ'}
          >
            <FiTrash2 size={16} className={category.post_count > 0 ? "opacity-30" : ""} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;