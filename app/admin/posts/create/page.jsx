'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '../../../components/AdminNavbar';
import ImageSelectorModal from '../../components/ImageSelectorModal';
import PostForm from '../../components/PostForm';
import useAuth from '../../../hooks/useAuth';
import useCategories from '../../../hooks/useCategories';
import usePostForm from '../../../hooks/usePostForm';

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  const { 
    formData, 
    errors, 
    submitting, 
    handleChange, 
    handleEditorChange,
    handleSelectFeaturedImage, 
    handleSubmit 
  } = usePostForm();
  
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  
  // รวม loading states
  const loading = authLoading || categoriesLoading;

  if (loading) {
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
        <div className="bg-base-100 rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">เพิ่มบทความใหม่</h1>
            <Link href="/admin/posts" className="btn btn-neutral">
              กลับไปหน้ารายการ
            </Link>
          </div>
          
          <PostForm 
            formData={formData}
            errors={errors}
            categories={categories}
            handleChange={handleChange}
            handleEditorChange={handleEditorChange}
            handleSubmit={handleSubmit}
            openImageSelector={() => setIsImageSelectorOpen(true)}
            submitting={submitting}
            isEdit={false}
          />
        </div>
      </div>
      
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectFeaturedImage}
      />
    </div>
  );
}