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
    <div className="min-h-screen bg-zinc-950">
      <AdminNavbar user={user} onLogout={handleLogout} />
      
      <div className="w-full px-6 pt-6">
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
      
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectFeaturedImage}
      />
    </div>
  );
}