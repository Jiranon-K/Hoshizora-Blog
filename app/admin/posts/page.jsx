'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../components/AdminNavbar';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const router = useRouter();

  useEffect(() => {
    
    const userData = localStorage.getItem('blog_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }

    
    fetchPosts();
    
    
    fetchCategories();
  }, [router]);

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
    }
  };

  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('blog_user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${deleteId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      
      fetchPosts();
      
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('เกิดข้อผิดพลาดในการลบบทความ');
    }
  };

  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category_id === parseInt(categoryFilter);
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">จัดการบทความ</h1>
            <Link 
              href="/admin/posts/create" 
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              เพิ่มบทความใหม่
            </Link>
          </div>
          
          {/* ส่วนกรองและค้นหา */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="form-control w-full md:w-1/3">
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="ค้นหาบทความ..." 
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-control w-full md:w-1/4">
              <select 
                className="select select-bordered w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">สถานะทั้งหมด</option>
                <option value="published">เผยแพร่แล้ว</option>
                <option value="draft">ฉบับร่าง</option>
                <option value="archived">เก็บถาวร</option>
              </select>
            </div>
            
            <div className="form-control w-full md:w-1/4">
              <select 
                className="select select-bordered w-full"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">หมวดหมู่ทั้งหมด</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* ตารางบทความ */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-neutral text-neutral-content">
                  <th className="w-14">ID</th>
                  <th>หัวข้อ</th>
                  <th>หมวดหมู่</th>
                  <th>สถานะ</th>
                  <th>ยอดเข้าชม</th>
                  <th>วันที่สร้าง</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium">{post.title}</span>
                          <span className="text-xs text-gray-500">{post.slug}</span>
                        </div>
                      </td>
                      <td>{getCategoryName(post.category_id)}</td>
                      <td>
                        <div className={`badge ${getStatusColor(post.status)}`}>
                          {getStatusText(post.status)}
                        </div>
                      </td>
                      <td>{post.views}</td>
                      <td>{new Date(post.created_at).toLocaleDateString('th-TH')}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/posts/edit/${post.id}`} 
                            className="btn btn-sm btn-neutral"
                          >
                            แก้ไข
                          </Link>
                          <button 
                            className="btn btn-sm btn-error"
                            onClick={() => openDeleteModal(post.id)}
                          >
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">ไม่พบบทความ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ยืนยันการลบบทความ</h3>
            <p className="py-4">คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div className="modal-action">
              <button className="btn btn-neutral" onClick={() => setDeleteModalOpen(false)}>ยกเลิก</button>
              <button className="btn btn-error" onClick={handleDelete}>ลบบทความ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}