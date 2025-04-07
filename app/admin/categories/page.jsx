'use client';

import React from 'react';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import CategoryTable from '../components/categories/CategoryTable';
import CategoryForm from '../components/categories/CategoryForm';
import DeleteCategoryModal from '../components/categories/DeleteCategoryModal';
import useAuth from '../../hooks/useAuth';
import useCategoryManagement from '../../hooks/useCategoryManagement';

export default function CategoriesPage() {
  // ใช้ custom hooks
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { 
    categories, 
    loading, 
    error,
    isFormOpen,
    formData,
    formErrors,
    submitting,
    editingCategory,
    handleFormChange,
    openAddForm,
    openEditForm,
    closeForm,
    handleSubmit,
    deleteModalOpen,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete
  } = useCategoryManagement();

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
          {/* หัวข้อและปุ่มเพิ่มหมวดหมู่ใหม่ */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-primary">จัดการหมวดหมู่</h1>
            <button 
              onClick={openAddForm}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              เพิ่มหมวดหมู่ใหม่
            </button>
          </div>
          
          {/* แสดงข้อความผิดพลาด (ถ้ามี) */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* ตารางแสดงรายการหมวดหมู่ */}
          <CategoryTable 
            categories={categories} 
            onEdit={openEditForm}
            onDelete={openDeleteModal}
            loading={loading}
          />
          
          {/* ลิงก์กลับไปหน้า Dashboard */}
          <div className="mt-6 text-center">
            <Link href="/admin" className="btn btn-outline btn-neutral">
              กลับไปหน้า Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* ฟอร์มเพิ่ม/แก้ไขหมวดหมู่ */}
      <CategoryForm 
        isOpen={isFormOpen}
        onClose={closeForm}
        formData={formData}
        formErrors={formErrors}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        isEditing={!!editingCategory}
      />
      
      {/* โมดัลยืนยันการลบ */}
      <DeleteCategoryModal 
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleteLoading}
        errorMessage={deleteError}
      />
    </div>
  );
}