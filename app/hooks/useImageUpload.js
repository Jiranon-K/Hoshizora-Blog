'use client';

import { useState } from 'react';
import { getImageUrl } from '@/lib/helpers';

export default function useImageUpload() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/uploads');
      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    
    setUploadFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!uploadFile) return;
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', uploadFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'อัพโหลดล้มเหลว');
      }
      
      setImages([{ name: uploadFile.name, url: data.url }, ...images]);
      
      setUploadFile(null);
      setPreviewUrl('');
      
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`อัพโหลดล้มเหลว: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  return {
    images,
    loading,
    uploadFile,
    previewUrl,
    uploading,
    fetchImages,
    handleFileChange,
    handleUpload,
    setUploadFile,
    setPreviewUrl
  };
}