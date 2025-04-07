'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function usePostForm(initialData = null) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {
    title: '',
    slug: '',
    description: '',
    content: '',
    featured_image: '',
    status: 'draft',
    category_id: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(initialData?.featured_image || '');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\sก-๙]/g, '') 
        .replace(/\s+/g, '-') 
        .replace(/ก-๙+/g, (match) => encodeURIComponent(match)) 
        .replace(/-+/g, '-'); 
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        slug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSelectFeaturedImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      featured_image: imageUrl
    }));
    setPreviewImage(imageUrl);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'กรุณาระบุชื่อเรื่อง';
    }
    
    if (!formData.slug?.trim()) {
      newErrors.slug = 'กรุณาระบุ slug';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมาย - เท่านั้น';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'กรุณาระบุคำอธิบายย่อ';
    }
    
    if (!formData.content?.trim()) {
      newErrors.content = 'กรุณาใส่เนื้อหาบทความ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, postId = null) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const url = postId ? `/api/posts/${postId}` : '/api/posts';
      const method = postId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกบทความ');
      }
      
      router.push('/admin/posts');
      
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error.message || 'เกิดข้อผิดพลาดในการบันทึกบทความ');
    } finally {
      setSubmitting(false);
    }
  };
  
  return {
    formData,
    setFormData,
    errors,
    submitting,
    previewImage,
    handleChange,
    handleEditorChange,
    handleSelectFeaturedImage,
    handleSubmit
  };
}