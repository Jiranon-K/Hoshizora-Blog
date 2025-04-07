'use client';

import React from 'react';

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
    <tr>
      <td>{category.id}</td>
      <td>{category.name}</td>
      <td>
        <code className="text-xs bg-gray-100 p-1 rounded">{category.slug}</code>
      </td>
      <td>
        <div className="badge badge-neutral">{category.post_count || 0}</div>
      </td>
      <td>{formatDate(category.created_at)}</td>
      <td>
        <div className="flex gap-2">
          <button 
            onClick={onEdit} 
            className="btn btn-sm btn-neutral"
          >
            แก้ไข
          </button>
          <button 
            onClick={onDelete} 
            className="btn btn-sm btn-error"
            disabled={category.post_count > 0}
            title={category.post_count > 0 ? 'ไม่สามารถลบได้เนื่องจากมีบทความที่ใช้หมวดหมู่นี้' : ''}
          >
            ลบ
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;