'use client';

import React from 'react';
import UserRow from './UserRow';

const UserTable = ({ 
  users, 
  getRoleText,
  getRoleBadgeColor,
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
              <th>ชื่อที่แสดง</th>
              <th>ชื่อผู้ใช้</th>
              <th>อีเมล</th>
              <th>ตำแหน่ง</th>
              <th>สิทธิ์</th>
              <th>วันที่สร้าง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="text-center py-4">
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
            <th>ชื่อที่แสดง</th>
            <th>ชื่อผู้ใช้</th>
            <th>อีเมล</th>
            <th>ตำแหน่ง</th>
            <th>สิทธิ์</th>
            <th>วันที่สร้าง</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow 
                key={user.id} 
                user={user} 
                getRoleText={getRoleText}
                getRoleBadgeColor={getRoleBadgeColor}
                onEdit={() => onEdit(user.id)} 
                onDelete={() => onDelete(user.id)} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">ไม่พบข้อมูลผู้ใช้</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;