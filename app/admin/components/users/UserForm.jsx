'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api-helpers';
import ImageSelectorModal from '../../components/ImageSelectorModal';
import { getImageUrl } from '@/lib/helpers';
import toast from 'react-hot-toast';
import { FiCamera } from 'react-icons/fi';

const UserForm = ({ 
  userId = null,
  isAdmin = false
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    display_name: '',
    avatar: '/avatar/default.webp',
    title: '',
    bio: '',
    role: 'author'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  
  // โหลดข้อมูลผู้ใช้กรณีแก้ไข
  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await fetchApi(`/api/users/${userId}`);
      setFormData({
        ...data,
        password: '',
        confirm_password: ''
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      router.push('/admin/users');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectAvatar = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      avatar: imageUrl
    }));
    setIsImageSelectorOpen(false);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username?.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!userId && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'Display name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      
      const { confirm_password, ...dataToSubmit } = formData;
      
      
      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      if (userId) {
        // แก้ไขผู้ใช้
        await fetchApi(`/api/users/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(dataToSubmit)
        });
      } else {
        // เพิ่มผู้ใช้ใหม่
        await fetchApi('/api/users', {
          method: 'POST',
          body: JSON.stringify(dataToSubmit)
        });
      }
      
      router.push('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Error saving user data');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* ข้อมูลส่วนซ้าย */}
          <div className="space-y-6">
            <h3 className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-4 border-b border-zinc-900 pb-2">Account Details</h3>
            
            {/* ชื่อผู้ใช้ */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Username</label>
              <input 
                type="text" 
                name="username"
                value={formData.username || ''}
                onChange={handleChange}
                className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Enter username"
              />
              {errors.username && <span className="text-red-400 text-xs mt-1">{errors.username}</span>}
            </div>
            
            {/* อีเมล */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="email@example.com"
              />
              {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email}</span>}
            </div>
            
            {/* รหัสผ่าน */}
            <div className="space-y-2 pt-4">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                Password {userId && <span className="text-zinc-700 text-[10px] normal-case ml-2">(Leave blank to keep current)</span>}
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password || ''}
                onChange={handleChange}
                className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${errors.password ? 'border-red-500' : ''}`}
                placeholder={userId ? '••••••••' : 'Enter password'}
              />
              {errors.password && <span className="text-red-400 text-xs mt-1">{errors.password}</span>}
            </div>
            
            {/* ยืนยันรหัสผ่าน */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Confirm Password</label>
              <input 
                type="password" 
                name="confirm_password"
                value={formData.confirm_password || ''}
                onChange={handleChange}
                className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${errors.confirm_password ? 'border-red-500' : ''}`}
                placeholder="Confirm password"
                disabled={!formData.password}
              />
              {errors.confirm_password && <span className="text-red-400 text-xs mt-1">{errors.confirm_password}</span>}
            </div>
          </div>
          
          {/* ข้อมูลส่วนขวา */}
          <div className="space-y-6">
            <h3 className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-4 border-b border-zinc-900 pb-2">Profile Details</h3>
            
            {/* รูปโปรไฟล์ */}
            <div className="flex items-start gap-6 mb-6">
                 <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 relative group">
                    <img 
                        src={getImageUrl(formData.avatar)} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.src = '/avatar/default.webp'; }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FiCamera className="text-white" />
                    </div>
                 </div>
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Avatar</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            name="avatar"
                            value={formData.avatar || ''}
                            onChange={handleChange}
                            className="bg-transparent border-b border-zinc-800 w-full text-xs text-zinc-400 focus:outline-none focus:border-white py-1"
                            placeholder="/avatar/..."
                            readOnly
                        />
                         <button
                            type="button"
                            className="px-3 py-1 bg-zinc-900 text-[10px] text-white uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                            onClick={() => setIsImageSelectorOpen(true)}
                            >
                            Select
                        </button>
                    </div>
                 </div>
            </div>

            {/* ชื่อที่แสดง */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Display Name</label>
              <input 
                type="text" 
                name="display_name"
                value={formData.display_name || ''}
                onChange={handleChange}
                className={`w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700 ${errors.display_name ? 'border-red-500' : ''}`}
                placeholder="Enter display name"
              />
              {errors.display_name && <span className="text-red-400 text-xs mt-1">{errors.display_name}</span>}
            </div>
            
            
            {/* ตำแหน่ง */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Title / Position</label>
              <input 
                type="text" 
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors placeholder:text-zinc-700"
                placeholder="e.g. Editor in Chief"
              />
            </div>
            
            {/* สิทธิ์การใช้งาน */}
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Role</label>
                <select 
                  name="role"
                  value={formData.role || 'author'}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                >
                  <option value="admin" className="bg-black">Admin</option>
                  <option value="author" className="bg-black">Author</option>
                  <option value="editor" className="bg-black">Editor</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* ประวัติโดยย่อ */}
        <div className="space-y-2 pt-6 border-t border-zinc-900">
          <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Bio</label>
          <textarea 
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            className="w-full bg-zinc-950/50 border border-zinc-800 p-4 text-sm text-white focus:outline-none focus:border-white transition-colors h-32 resize-none placeholder:text-zinc-700"
            placeholder="Write a short bio..."
          ></textarea>
        </div>
        
        {/* ปุ่มส่งฟอร์ม */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-zinc-900">
          <button 
            type="button" 
            className="px-6 py-3 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-colors"
            onClick={() => router.push('/admin/users')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (userId ? 'Save Changes' : 'Create User')}
          </button>
        </div>
      </form>
      
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectAvatar}
      />
    </>
  );
};

export default UserForm;