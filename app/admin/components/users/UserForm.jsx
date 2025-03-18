'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api-helpers';
import ImageSelectorModal from '../../components/ImageSelectorModal';
import { getImageUrl } from '@/lib/helpers';

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
      alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
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
    
    if (!formData.username.trim()) {
      newErrors.username = 'กรุณาระบุชื่อผู้ใช้';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'กรุณาระบุอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'กรุณาระบุอีเมลที่ถูกต้อง';
    }
    
    if (!userId && !formData.password) {
      newErrors.password = 'กรุณาระบุรหัสผ่าน';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    
    if (formData.password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'รหัสผ่านไม่ตรงกัน';
    }
    
    if (!formData.display_name.trim()) {
      newErrors.display_name = 'กรุณาระบุชื่อที่แสดง';
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
      alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ข้อมูลส่วนซ้าย */}
          <div className="space-y-6">
            {/* ชื่อผู้ใช้ */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ชื่อผู้ใช้</span>
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                placeholder="ระบุชื่อผู้ใช้"
              />
              {errors.username && <span className="text-error text-sm mt-1">{errors.username}</span>}
            </div>
            
            {/* อีเมล */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">อีเมล</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="ระบุอีเมล"
              />
              {errors.email && <span className="text-error text-sm mt-1">{errors.email}</span>}
            </div>
            
            {/* รหัสผ่าน */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  รหัสผ่าน {userId && '(เว้นว่างไว้หากไม่ต้องการเปลี่ยน)'}
                </span>
              </label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                placeholder={userId ? 'เว้นว่างไว้หากไม่ต้องการเปลี่ยน' : 'ระบุรหัสผ่าน'}
              />
              {errors.password && <span className="text-error text-sm mt-1">{errors.password}</span>}
            </div>
            
            {/* ยืนยันรหัสผ่าน */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ยืนยันรหัสผ่าน</span>
              </label>
              <input 
                type="password" 
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.confirm_password ? 'input-error' : ''}`}
                placeholder="ยืนยันรหัสผ่าน"
                disabled={!formData.password}
              />
              {errors.confirm_password && <span className="text-error text-sm mt-1">{errors.confirm_password}</span>}
            </div>
          </div>
          
          {/* ข้อมูลส่วนขวา */}
          <div className="space-y-6">
            {/* ชื่อที่แสดง */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ชื่อที่แสดง</span>
              </label>
              <input 
                type="text" 
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.display_name ? 'input-error' : ''}`}
                placeholder="ระบุชื่อที่แสดง"
              />
              {errors.display_name && <span className="text-error text-sm mt-1">{errors.display_name}</span>}
            </div>
            
            {/* รูปโปรไฟล์ */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">รูปโปรไฟล์</span>
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="input input-bordered w-full mr-2"
                  placeholder="URL ของรูปโปรไฟล์"
                  readOnly
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsImageSelectorOpen(true)}
                >
                  เลือกรูปภาพ
                </button>
              </div>
              
              {formData.avatar && (
                <div className="mt-2">
                  <img 
                    src={getImageUrl(formData.avatar)} 
                    alt="รูปโปรไฟล์" 
                    className="w-20 h-20 rounded-full object-cover border" 
                    onError={(e) => {
                      e.target.src = '/avatar/default.webp';
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* ตำแหน่ง */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ตำแหน่ง</span>
              </label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="ระบุตำแหน่ง (ไม่บังคับ)"
              />
            </div>
            
            {/* สิทธิ์การใช้งาน */}
            {isAdmin && (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">สิทธิ์การใช้งาน</span>
                </label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="admin">ผู้ดูแลระบบ</option>
                  <option value="author">ผู้เขียน</option>
                  <option value="editor">บรรณาธิการ</option>
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* ประวัติโดยย่อ */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">ประวัติโดยย่อ</span>
          </label>
          <textarea 
            name="bio"
            value={formData.bio || ''}
            onChange={handleChange}
            className="textarea textarea-bordered w-full h-32"
            placeholder="ระบุประวัติโดยย่อ (ไม่บังคับ)"
          ></textarea>
        </div>
        
        {/* ปุ่มส่งฟอร์ม */}
        <div className="flex justify-end gap-4 mt-6">
          <button 
            type="button" 
            className="btn btn-neutral"
            onClick={() => router.push('/admin/users')}
          >
            ยกเลิก
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 
              <><span className="loading loading-spinner loading-sm"></span> กำลังบันทึก...</> : 
              userId ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มผู้ใช้'
            }
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