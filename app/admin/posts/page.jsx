'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import SearchAndFilterBar from '../components/SearchAndFilterBar';
import PostsTable from '../components/PostsTable';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingIndicator from '../components/LoadingIndicator';
import useAuth from '../../hooks/useAuth';
import usePostManagement from '../../hooks/usePostManagement';

export default function PostsPage() {
  // ใช้ custom hooks
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { 
    posts, 
    categories, 
    loading: postsLoading, 
    deleteId,
    deleteModalOpen,
    deleteLoading,
    getCategoryName,
    getStatusText,
    getStatusColor,
    openDeleteModal,
    handleDelete,
    setDeleteModalOpen
  } = usePostManagement();

  // state สำหรับการค้นหาและกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // กรองบทความตามการค้นหาและตัวกรอง
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category_id === parseInt(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // แสดงตัวโหลดถ้ากำลังโหลดข้อมูล
  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <AdminNavbar user={user} onLogout={handleLogout} />
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <AdminNavbar user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* หัวข้อและปุ่มเพิ่มบทความใหม่ */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-blue-600">จัดการบทความ</h1>
            <Link 
              href="/admin/posts/create" 
              className="btn btn-primary bg-blue-800 border-none hover:bg-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              เพิ่มบทความใหม่
            </Link>
          </div>
          
          {/* แถบค้นหาและกรอง */}
          <SearchAndFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />
          
          {/* ตารางบทความ */}
          <PostsTable 
            posts={filteredPosts}
            getCategoryName={getCategoryName}
            getStatusText={getStatusText}
            getStatusColor={getStatusColor}
            onDeleteClick={openDeleteModal}
          />
        </div>
      </div>
      
      {/* โมดัลยืนยันการลบ */}
      <DeleteConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        isDeleting={deleteLoading}
      />
    </div>
  );
}