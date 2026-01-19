'use client';

import React from 'react';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import CategoryTable from '../components/categories/CategoryTable';
import CategoryForm from '../components/categories/CategoryForm';
import DeleteCategoryModal from '../components/categories/DeleteCategoryModal';
import useAuth from '../../hooks/useAuth';
import useCategoryManagement from '../../hooks/useCategoryManagement';
import { FiPlus, FiArrowLeft } from 'react-icons/fi';

export default function CategoriesPage() {
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: '"Mitr", sans-serif', fontWeight: 300 }}>
      <AdminNavbar user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
             <h1 className="text-3xl font-light tracking-tight text-white mb-2">
                หมวดหมู่  <span className="text-zinc-500 text-lg">/ จัดการ</span>
            </h1>
            <p className="text-zinc-400 font-light text-sm">
                จัดการและกำหนดสิทธิ์
            </p>
          </div>
          
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            <FiPlus size={16} />
            <span>เพิ่มหมวดหมู่</span>
          </button>
        </header>
          
        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-300 px-6 py-4 mb-8 flex items-center">
            <span className="mr-2">!</span> {error}
          </div>
        )}
        
        {/* Table */}
        <div className="mb-8">
            <CategoryTable 
                categories={categories} 
                onEdit={openEditForm}
                onDelete={openDeleteModal}
                loading={loading}
            />
        </div>
        
        {/* Back Link */}
        <div className="mt-8 border-t border-zinc-900 pt-8">
            <Link href="/admin" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-light">
                <FiArrowLeft />
                <span>กลับไปหน้าแดชบอร์ด</span>
            </Link>
        </div>
      </main>
      
      {/* Modals */}
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