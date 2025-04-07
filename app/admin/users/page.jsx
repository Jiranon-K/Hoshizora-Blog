'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../components/AdminNavbar';
import SearchAndFilterBar from '../components/users/SearchAndFilterBar';
import UserTable from '../components/users/UserTable';
import DeleteUserModal from '../components/users/DeleteUserModal';
import useAuth from '../../hooks/useAuth';
import useUserManagement from '../../hooks/useUserManagement';

export default function UsersPage() {

  const router = useRouter();  
  // ใช้ custom hooks
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { 
    users, 
    loading, 
    error,
    deleteModalOpen,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    getRoleText,
    getRoleBadgeColor
  } = useUserManagement();

  // state สำหรับการค้นหาและกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // ข้อมูลผู้ใช้ที่กำลังจะลบ
  const [deletingUser, setDeletingUser] = useState(null);

  // กรองผู้ใช้ตามการค้นหาและตัวกรอง
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // เปิดโมดัลยืนยันการลบผู้ใช้
  const handleOpenDeleteModal = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete) {
      setDeletingUser(userToDelete);
      openDeleteModal(userId);
    }
  };
 

  // นำทางไปยังหน้าแก้ไขผู้ใช้
  const handleEditUser = (userId) => {
    router.push(`/admin/users/edit/${userId}`);
  };

  // แสดงตัวโหลดถ้ากำลังโหลดข้อมูล
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <AdminNavbar user={user} onLogout={handleLogout} />
        <div className="flex justify-center items-center h-[80vh]">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <AdminNavbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* หัวข้อและปุ่มเพิ่มผู้ใช้ใหม่ */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-indigo-600">จัดการผู้ใช้</h1>
            <Link 
              href="/admin/users/create" 
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              เพิ่มผู้ใช้ใหม่
            </Link>
          </div>
          
          {/* แสดงข้อความผิดพลาด  */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* แถบค้นหาและกรอง */}
          <SearchAndFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
          
          {/* ตารางแสดงรายการผู้ใช้ */}
          <UserTable 
            users={filteredUsers} 
            getRoleText={getRoleText}
            getRoleBadgeColor={getRoleBadgeColor}
            onEdit={handleEditUser}
            onDelete={handleOpenDeleteModal}
            loading={loading}
          />
          
            {/* ปุ่มกลับไปหน้า Dashboard */}
          <div className="mt-6 text-center">
            <Link href="/admin" className="btn btn-outline btn-neutral">
              กลับไปหน้า Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* โมดัลยืนยันการลบ */}
      <DeleteUserModal 
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleteLoading}
        errorMessage={deleteError}
        userName={deletingUser?.display_name || ''}
      />
    </div>
  );
}