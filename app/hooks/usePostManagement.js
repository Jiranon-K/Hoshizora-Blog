'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function usePostManagement() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('ไม่สามารถดึงข้อมูลบทความได้: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้: ' + error.message);
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      toast.error('ไม่พบ ID ของบทความที่ต้องการลบ');
      setDeleteModalOpen(false);
      return;
    }
    
    try {
      setDeleteLoading(true);
      
      const response = await fetch(`/api/posts/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ไม่สามารถลบบทความได้');
      }
      
      const data = await response.json();
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== deleteId));
      
      setDeleteModalOpen(false);
      setDeleteId(null);
      
      toast.success(data.message || 'ลบบทความเรียบร้อยแล้ว');
      
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'เกิดข้อผิดพลาดในการลบบทความ');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'ไม่มีหมวดหมู่';
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'ฉบับร่าง';
      case 'published': return 'เผยแพร่แล้ว';
      case 'archived': return 'เก็บถาวร';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'badge-warning';
      case 'published': return 'badge-success';
      case 'archived': return 'badge-ghost';
      default: return 'badge-neutral';
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  return {
    posts,
    categories,
    loading,
    deleteId,
    deleteModalOpen,
    deleteLoading,
    fetchPosts,
    fetchCategories,
    openDeleteModal,
    handleDelete,
    getCategoryName,
    getStatusText,
    getStatusColor,
    setDeleteModalOpen
  };
}