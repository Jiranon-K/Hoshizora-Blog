'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api-helpers';

export default function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // สถานะสำหรับการลบผู้ใช้
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // ดึงข้อมูลผู้ใช้ทั้งหมด
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchApi('/api/users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลเมื่อเริ่มต้น
  useEffect(() => {
    fetchUsers();
  }, []);

  // เปิดโมดัลยืนยันการลบ
  const openDeleteModal = (userId) => {
    setDeletingUserId(userId);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  // ปิดโมดัลยืนยันการลบ
  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingUserId(null);
    setDeleteError(null);
  };

  // ลบผู้ใช้
  const handleDelete = async () => {
    if (!deletingUserId) {
      return;
    }
    
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      await fetchApi(`/api/users/${deletingUserId}`, {
        method: 'DELETE'
      });
      
      // ลบข้อมูลจากสถานะ
      setUsers(prev => prev.filter(user => user.id !== deletingUserId));
      
      // ปิดโมดัล
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError(err.message || 'เกิดข้อผิดพลาดในการลบผู้ใช้');
    } finally {
      setDeleteLoading(false);
    }
  };

  // แปลงค่า role เป็นข้อความภาษาไทย
  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'ผู้ดูแลระบบ';
      case 'author': return 'ผู้เขียน';
      case 'editor': return 'บรรณาธิการ';
      default: return role;
    }
  };

  // แปลงค่า role เป็นสี
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'badge-primary';
      case 'author': return 'badge-secondary';
      case 'editor': return 'badge-accent';
      default: return 'badge-neutral';
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    deleteModalOpen,
    deleteLoading,
    deleteError,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    getRoleText,
    getRoleBadgeColor
  };
}