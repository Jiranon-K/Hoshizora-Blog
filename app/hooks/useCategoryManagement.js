'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-helpers';

export default function useCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // สถานะสำหรับการจัดการฟอร์ม
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  // สถานะสำหรับการลบหมวดหมู่
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ดึงข้อมูลหมวดหมู่
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchApi('/api/categories');
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อเริ่มต้น
  useEffect(() => {
    fetchCategories();
  }, []);

  // สร้าง slug อัตโนมัติจากชื่อ
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\sก-๙]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[ก-๙]+/g, (match) => encodeURIComponent(match))
      .replace(/-+/g, '-');
  };

  // จัดการการเปลี่ยนแปลงในฟอร์ม
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // สร้าง slug อัตโนมัติเมื่อกรอกชื่อ
    if (name === 'name' && (!formData.slug || formData.slug === generateSlug(formData.name))) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ตรวจสอบความถูกต้องของข้อมูลฟอร์ม
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'กรุณากรอกชื่อหมวดหมู่';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'กรุณากรอก slug';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมาย - เท่านั้น';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // เปิดฟอร์มเพิ่มหมวดหมู่
  const openAddForm = () => {
    setFormData({ name: '', slug: '' });
    setFormErrors({});
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  // เปิดฟอร์มแก้ไขหมวดหมู่
  const openEditForm = (category) => {
    setFormData({
      name: category.name,
      slug: category.slug
    });
    setFormErrors({});
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  // ปิดฟอร์ม
  const closeForm = () => {
    setIsFormOpen(false);
    setFormData({ name: '', slug: '' });
    setFormErrors({});
    setEditingCategory(null);
  };

  // บันทึกข้อมูลหมวดหมู่ (เพิ่ม/แก้ไข)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (editingCategory) {
        // แก้ไขหมวดหมู่
        const updatedCategory = await fetchApi(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        
        // อัปเดตข้อมูลในสถานะ
        setCategories(prev => 
          prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
        );
      } else {
        // เพิ่มหมวดหมู่ใหม่
        const newCategory = await fetchApi('/api/categories', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        
        // เพิ่มข้อมูลในสถานะ
        setCategories(prev => [...prev, newCategory]);
      }
      
      // ปิดฟอร์ม
      closeForm();
    } catch (err) {
      console.error('Error saving category:', err);
      
      // จัดการข้อผิดพลาดเฉพาะ
      if (err.message.includes('Slug นี้ถูกใช้งานแล้ว')) {
        setFormErrors(prev => ({ ...prev, slug: 'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น' }));
      } else {
        alert(err.message || 'เกิดข้อผิดพลาดในการบันทึกหมวดหมู่');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // เปิดโมดัลยืนยันการลบ
  const openDeleteModal = (categoryId) => {
    setDeletingCategoryId(categoryId);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  // ปิดโมดัลยืนยันการลบ
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingCategoryId(null);
    setDeleteError(null);
  };

  // ลบหมวดหมู่
  const handleDelete = async () => {
    if (!deletingCategoryId) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      await fetchApi(`/api/categories/${deletingCategoryId}`, {
        method: 'DELETE'
      });
      
      // ลบข้อมูลจากสถานะ
      setCategories(prev => prev.filter(cat => cat.id !== deletingCategoryId));
      
      // ปิดโมดัล
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting category:', err);
      setDeleteError(err.message || 'เกิดข้อผิดพลาดในการลบหมวดหมู่');
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    // ข้อมูลหมวดหมู่
    categories,
    loading,
    error,
    fetchCategories,
    
    // การจัดการฟอร์ม
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
    
    // การลบหมวดหมู่
    deleteModalOpen,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete
  };
}