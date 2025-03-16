'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '../../../../components/AdminNavbar';
import Link from 'next/link';
import dynamic from 'next/dynamic';


const RichTextEditor = dynamic(() => import('../../../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded"></div>
});

export default function EditPostPage({ params }) {
  const router = useRouter();
  
  const [postId, setPostId] = useState(null);
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    featured_image: '',
    status: 'draft',
    category_id: ''
  });
  
  const [errors, setErrors] = useState({});
  
  
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const idFromUrl = pathSegments[pathSegments.length - 1];
    setPostId(idFromUrl);

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
  }, [router]);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
      fetchCategories();
    }
  }, [postId]);

  const fetchPost = async (id) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      
      setFormData({
        title: data.title || '',
        slug: data.slug || '',
        description: data.description || '',
        content: data.content || '',
        featured_image: data.featured_image || '',
        status: data.status || 'draft',
        category_id: data.category_id?.toString() || ''
      });
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('ไม่สามารถดึงข้อมูลบทความได้');
      router.push('/admin/posts');
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // จัดการเมื่อเนื้อหาจาก Rich Text Editor มีการเปลี่ยนแปลง
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  // จัดการเมื่อเลือกรูปภาพจาก Modal
  const handleSelectFeaturedImage = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      featured_image: imageUrl
    }));
    setIsImageSelectorOpen(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณาระบุชื่อเรื่อง';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'กรุณาระบุ slug';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมาย - เท่านั้น';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณาระบุคำอธิบายย่อ';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'กรุณาใส่เนื้อหาบทความ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postId) {
      alert('ไม่พบ ID ของบทความที่ต้องการแก้ไข');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการอัปเดตบทความ');
      }
      
      router.push('/admin/posts');
      
    } catch (error) {
      console.error('Error updating post:', error);
      alert(error.message || 'เกิดข้อผิดพลาดในการอัปเดตบทความ');
    } finally {
      setSubmitting(false);
    }
  };

  // Modal เลือกรูปภาพ
  const ImageSelectorModal = ({ isOpen, onClose, onSelectImage }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    
    // โหลดรายการรูปภาพเมื่อ modal เปิด
    useEffect(() => {
      if (isOpen) {
        fetchImages();
      }
    }, [isOpen]);
    
    // ดึงรายการรูปภาพที่มีอยู่
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
    
    // จัดการเมื่อเลือกไฟล์จากเครื่อง
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }
      
      setUploadFile(file);
      
      // แสดงตัวอย่างรูปภาพ
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    };
    
    // อัพโหลดรูปภาพไปยังเซิร์ฟเวอร์
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
        
        alert('อัพโหลดรูปภาพสำเร็จ');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`อัพโหลดล้มเหลว: ${error.message}`);
      } finally {
        setUploading(false);
      }
    };
    
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">เลือกรูปภาพหน้าปก</h3>
          </div>
          
          {/* อัพโหลดรูปภาพ */}
          <div className="p-4 border-b">
            <h4 className="font-medium mb-2">อัพโหลดรูปภาพใหม่</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
                <button
                  onClick={handleUpload}
                  disabled={!uploadFile || uploading}
                  className="btn btn-primary mt-2 w-full"
                >
                  {uploading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      กำลังอัพโหลด...
                    </>
                  ) : (
                    'อัพโหลดรูปภาพ'
                  )}
                </button>
              </div>
              
              {/* ตัวอย่างรูปภาพ */}
              {previewUrl && (
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-gray-100 border rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="ตัวอย่าง"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* แสดงรูปภาพที่มีอยู่แล้ว */}
          <div className="p-4 flex-1 overflow-y-auto">
            <h4 className="font-medium mb-2">รูปภาพที่มีอยู่</h4>
            {loading ? (
              <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : images.length === 0 ? (
              <div className="bg-gray-50 rounded-md p-8 text-center text-gray-500">
                ยังไม่มีรูปภาพที่อัพโหลด
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div
                    key={image.url}
                    onClick={() => onSelectImage(image.url)}
                    className="aspect-square border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* ปุ่มปิด Modal */}
          <div className="p-4 border-t">
            <button onClick={onClose} className="btn btn-neutral w-full">
              ปิด
            </button>
          </div>
        </div>
      </div>
    );
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">แก้ไขบทความ</h1>
            <Link href="/admin/posts" className="btn btn-neutral">
              กลับไปหน้ารายการ
            </Link>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ชื่อเรื่อง */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ชื่อเรื่อง</span>
              </label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                placeholder="ระบุชื่อเรื่อง"
              />
              {errors.title && <span className="text-error text-sm mt-1">{errors.title}</span>}
            </div>
            
            {/* Slug */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Slug (URL)</span>
              </label>
              <input 
                type="text" 
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.slug ? 'input-error' : ''}`}
                placeholder="ระบุ slug (e.g., my-post-title)"
              />
              {errors.slug && <span className="text-error text-sm mt-1">{errors.slug}</span>}
              <span className="text-sm text-gray-500 mt-1">URL ของบทความจะเป็น: yourdomain.com/blog/{formData.slug || 'your-slug'}</span>
            </div>
            
            {/* คำอธิบายย่อ */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">คำอธิบายย่อ</span>
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`textarea textarea-bordered w-full h-24 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="ระบุคำอธิบายย่อของบทความ"
              ></textarea>
              {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
            </div>
            
            {/* เนื้อหา (Rich Text Editor) */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">เนื้อหาบทความ</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleEditorChange}
                placeholder="ใส่เนื้อหาบทความของคุณที่นี่..."
              />
              {errors.content && <span className="text-error text-sm mt-1">{errors.content}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ภาพปก */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">ภาพปก</span>
                </label>
                <div className="flex items-center">
                  <input 
                    type="text" 
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    className="input input-bordered w-full mr-2"
                    placeholder="URL ของภาพปก"
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
                {formData.featured_image && (
                  <div className="mt-2">
                    <img 
                      src={formData.featured_image} 
                      alt="ภาพตัวอย่าง" 
                      className="w-full max-w-xs rounded-md shadow-sm" 
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                        e.target.alt = 'ไม่สามารถโหลดภาพได้';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {/* หมวดหมู่ */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">หมวดหมู่</span>
                  </label>
                  <select 
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">-- เลือกหมวดหมู่ --</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* สถานะ */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">สถานะ</span>
                  </label>
                  <select 
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="draft">ฉบับร่าง</option>
                    <option value="published">เผยแพร่</option>
                    <option value="archived">เก็บถาวร</option>
                  </select>
                </div>
                
                {/* ข้อมูลเพิ่มเติม */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">ข้อมูลเพิ่มเติม</span>
                  </label>
                  <div className="bg-base-200 p-4 rounded-md text-sm space-y-2">
                    <p>
                      <span className="font-semibold">ID:</span> {post?.id}
                    </p>
                    <p>
                      <span className="font-semibold">ยอดเข้าชม:</span> {post?.views || 0}
                    </p>
                    <p>
                      <span className="font-semibold">วันที่สร้าง:</span> {post?.created_at ? new Date(post.created_at).toLocaleString('th-TH') : '-'}
                    </p>
                    <p>
                      <span className="font-semibold">วันที่เผยแพร่:</span> {post?.published_at ? new Date(post.published_at).toLocaleString('th-TH') : '-'}
                    </p>
                    <p>
                      <span className="font-semibold">วันที่แก้ไขล่าสุด:</span> {post?.updated_at ? new Date(post.updated_at).toLocaleString('th-TH') : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ปุ่มส่งฟอร์ม */}
            <div className="flex justify-end gap-4 mt-6">
              <Link href="/admin/posts" className="btn btn-neutral">
                ยกเลิก
              </Link>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 
                  <><span className="loading loading-spinner loading-sm"></span> กำลังบันทึก...</> : 
                  'บันทึกการเปลี่ยนแปลง'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
      
      
      <ImageSelectorModal
        isOpen={isImageSelectorOpen}
        onClose={() => setIsImageSelectorOpen(false)}
        onSelectImage={handleSelectFeaturedImage}
      />
    </div>
  );
}