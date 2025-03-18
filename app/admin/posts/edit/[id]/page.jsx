'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '../../../../components/AdminNavbar';
import ImageSelectorModal from '../../../components/ImageSelectorModal';
import PostForm from '../../../components/PostForm';
import useAuth from '../../../../hooks/useAuth';
import useCategories from '../../../../hooks/useCategories';
import usePostForm from '../../../../hooks/usePostForm';

export default function EditPostPage({ params }) {
  const router = useRouter();
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  
  const { 
    formData, 
    setFormData,
    errors, 
    submitting, 
    handleChange, 
    handleEditorChange,
    handleSelectFeaturedImage, 
    handleSubmit: submitForm
  } = usePostForm();
  
  // รับ ID จาก URL
  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const idFromUrl = pathSegments[pathSegments.length - 1];
    setPostId(idFromUrl);
  }, []);
  
  // โหลดข้อมูลบทความ
  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
  }, [postId]);
  
  const fetchPost = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        content: data.content || '',
        featured_image: data.featured_image || '',
        status: data.status || 'draft',
        category_id: data.category_id?.toString() || ''
      });
      
      setPostLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('ไม่สามารถดึงข้อมูลบทความได้');
      router.push('/admin/posts');
    }
  };
  
  const handleSubmit = (e) => {
    submitForm(e, postId);
  };
  
  // รวม loading states
  const loading = authLoading || categoriesLoading || postLoading;

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
            <h1 className="text-2xl font-bold">แก้ไขบทความ</h1>
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
            isEdit={true}
            post={post}
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