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
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-neutral text-neutral-content">
              <th className="w-14">ID</th>
              <th>ชื่อหมวดหมู่</th>
              <th>Slug</th>
              <th>จำนวนบทความ</th>
              <th>วันที่สร้าง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" className="text-center py-4">
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-md"></span>
                  <span className="ml-2">กำลังโหลดข้อมูล...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-neutral text-neutral-content">
            <th className="w-14">ID</th>
            <th>ชื่อหมวดหมู่</th>
            <th>Slug</th>
            <th>จำนวนบทความ</th>
            <th>วันที่สร้าง</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
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
              <td colSpan="6" className="text-center py-4">ไม่พบข้อมูลหมวดหมู่</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;