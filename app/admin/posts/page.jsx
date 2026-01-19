"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
import useAuth from '../../hooks/useAuth';
import usePostManagement from '../../hooks/usePostManagement';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiTrash2, FiEdit3, FiFilter, FiX, FiCheck, FiMoreHorizontal } from 'react-icons/fi';

export default function PostsPage() {
  const { user, loading: authLoading, handleLogout } = useAuth();
  const { 
    posts, 
    categories, 
    loading: postsLoading, 
    deleteId,
    deleteModalOpen,
    deleteLoading,
    handleDelete,
    openDeleteModal,
    setDeleteModalOpen
  } = usePostManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter Logic
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category_id === parseInt(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (authLoading || postsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="loading loading-spinner text-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black" style={{ fontFamily: '"Mitr", sans-serif', fontWeight: 300 }}>
      <AdminNavbar user={user} onLogout={handleLogout} />
      
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
             <h1 className="text-4xl font-light tracking-tight text-white mb-2">
              จัดการบทความ <span className="text-zinc-500">/ ทั้งหมด</span>
            </h1>
            <p className="text-zinc-400 font-light">
              มีบทความทั้งหมด {posts.length} รายการ
            </p>
          </div>
          <Link 
            href="/admin/posts/create" 
            className="flex items-center gap-2 bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            <FiPlus size={16} />
            สร้างบทความใหม่
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-zinc-950 border border-zinc-900 p-4 mb-8 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors">
                    <FiSearch size={18} />
                </div>
                <input 
                    type="text"
                    placeholder="ค้นหา..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-white py-2 pl-10 pr-4 text-sm text-white focus:outline-none transition-colors placeholder:text-zinc-700"
                />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
                <div className="relative min-w-[140px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                        <FiFilter size={14} />
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs py-2.5 pl-9 pr-3 focus:outline-none focus:border-white appearance-none cursor-pointer hover:text-white transition-colors"
                    >
                        <option value="all">สถานะทั้งหมด</option>
                        <option value="published">เผยแพร่แล้ว</option>
                        <option value="draft">ฉบับร่าง</option>
                    </select>
                </div>

                <div className="relative min-w-[140px]">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                        <FiFilter size={14} />
                    </div>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                         className="w-full bg-black border border-zinc-800 text-zinc-300 text-xs py-2.5 pl-9 pr-3 focus:outline-none focus:border-white appearance-none cursor-pointer hover:text-white transition-colors"
                    >
                        <option value="all">หมวดหมู่ทั้งหมด</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        
        {/* Table List */}
        <div className="border-t border-zinc-800">
            {filteredPosts.length === 0 ? (
                <div className="py-20 text-center text-zinc-500 font-light">
                    ไม่พบบทความที่ตรงกับเงื่อนไข
                </div>
            ) : (
                <div className="w-full text-left">
                    <div className="grid grid-cols-12 gap-4 py-3 border-b border-zinc-900 text-[10px] uppercase tracking-widest text-zinc-500 font-medium px-4">
                        <div className="col-span-6 md:col-span-5">หัวข้อ</div>
                        <div className="hidden md:block col-span-2">หมวดหมู่</div>
                        <div className="col-span-3 md:col-span-2 text-center">สถานะ</div>
                        <div className="hidden md:block col-span-2 text-right">วันที่</div>
                        <div className="col-span-3 md:col-span-1 text-right">จัดการ</div>
                    </div>

                    <div className="divide-y divide-zinc-900/50">
                        {filteredPosts.map(post => {
                            const category = categories.find(c => c.id === post.category_id);
                            return (
                                <div key={post.id} className="grid grid-cols-12 gap-4 py-4 items-center px-4 hover:bg-zinc-900/30 transition-colors group">
                                    <div className="col-span-6 md:col-span-5">
                                        <h3 className="text-white font-light text-sm truncate pr-4">{post.title}</h3>
                                        <p className="text-zinc-500 text-xs truncate mt-1 font-light opacity-60 group-hover:opacity-100 transition-opacity">
                                            {post.description || "ไม่มีคำอธิบาย"}
                                        </p>
                                    </div>
                                    <div className="hidden md:block col-span-2">
                                        <span className="text-xs text-zinc-400 border border-zinc-800 px-2 py-1 rounded-sm">
                                            {category ? category.name : 'ไม่ระบุ'}
                                        </span>
                                    </div>
                                    <div className="col-span-3 md:col-span-2 flex justify-center">
                                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border ${
                                            post.status === 'published' 
                                                ? 'border-white/20 bg-white/5 text-white' 
                                                : 'border-zinc-800 bg-black text-zinc-500'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                post.status === 'published' ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'bg-zinc-600'
                                            }`} />
                                            <span className="text-[10px] uppercase tracking-widest font-bold">
                                                {post.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="hidden md:block col-span-2 text-right">
                                        <span className="text-xs text-zinc-500 font-mono">
                                             {new Date(post.created_at).toLocaleDateString('th-TH')}
                                        </span>
                                    </div>
                                    <div className="col-span-3 md:col-span-1 flex justify-end gap-2">
                                        <Link 
                                            href={`/admin/posts/edit/${post.id}`}
                                            className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-sm transition-colors"
                                        >
                                            <FiEdit3 size={16} />
                                        </Link>
                                        <button 
                                            onClick={() => openDeleteModal(post.id)}
                                            className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Custom Minimal Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDeleteModalOpen(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-zinc-950 border border-zinc-800 p-8 max-w-sm w-full shadow-2xl"
                >
                    <h3 className="text-xl font-light text-white mb-2">ยืนยันการลบ?</h3>
                    <p className="text-zinc-400 font-light text-sm mb-8 leading-relaxed">
                        คุณต้องการลบบทความนี้ใช่หรือไม่? <br/>
                        การกระทำนี้<span className="text-red-400">ไม่สามารถย้อนกลับได้</span>
                    </p>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="flex-1 bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                        >
                            {deleteLoading ? "กำลังลบ..." : "ยืนยันลบ"}
                        </button>
                        <button 
                            onClick={() => setDeleteModalOpen(false)}
                            className="flex-1 border border-zinc-800 text-zinc-400 py-3 text-xs font-bold uppercase tracking-widest hover:text-white hover:border-zinc-600 transition-colors"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}