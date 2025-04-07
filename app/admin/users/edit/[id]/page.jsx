'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminNavbar from '../../../../components/AdminNavbar';
import UserForm from '../../../components/users/UserForm';
import useAuth from '../../../../hooks/useAuth';

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id;
  const { user, loading: authLoading, handleLogout } = useAuth();

  
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-indigo-600">แก้ไขข้อมูลผู้ใช้</h1>
            <Link href="/admin/users" className="btn btn-neutral">
              กลับไปหน้าจัดการผู้ใช้
            </Link>
          </div>
          
          <UserForm userId={userId} isAdmin={user?.role === 'admin'} />
        </div>
      </div>
    </div>
  );
}