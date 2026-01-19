'use client';

import React from 'react';
import CategoryRow from './CategoryRow';

const CategoryTable = ({ 
  categories, 
  onEdit,
  onDelete,
  loading
}) => {
  if (loading) {
    return (
      <div className="overflow-x-auto border border-zinc-800 bg-zinc-950/50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-black text-xs uppercase tracking-widest text-zinc-500">
              <th className="p-4 font-medium">ชื่อหมวดหมู่</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">บทความ</th>
              <th className="p-4 font-medium">วันที่สร้าง</th>
              <th className="p-4 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="5" className="text-center py-12">
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-md text-white"></span>
                  <span className="ml-3 text-zinc-400 font-light">กำลังโหลดข้อมูล...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-zinc-800 bg-zinc-950/50">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-800 bg-black text-xs uppercase tracking-widest text-zinc-500">
            <th className="p-4 font-medium">ชื่อหมวดหมู่</th>
            <th className="p-4 font-medium">Slug</th>
            <th className="p-4 font-medium">บทความ</th>
            <th className="p-4 font-medium">วันที่สร้าง</th>
            <th className="p-4 font-medium">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryRow 
                key={category.id} 
                category={category} 
                onEdit={() => onEdit(category)} 
                onDelete={() => onDelete(category.id)} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-12 text-zinc-500 font-light">ไม่พบข้อมูลหมวดหมู่</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;