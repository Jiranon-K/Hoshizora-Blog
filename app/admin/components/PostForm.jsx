'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CategoriesSelect from '../components/CategoriesSelect';
import StatusSelect from './StatusSelect';
import FeaturedImageField from '../components/FeaturedImageField';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded"></div>
});

const PostForm = ({ 
  formData, 
  errors, 
  categories, 
  handleChange, 
  handleEditorChange, 
  handleSubmit, 
  openImageSelector, 
  submitting,
  isEdit = false,
  post = null
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ชื่อเรื่อง */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">ชื่อเรื่อง</span>
        </label>
        <input 
          type="text" 
          name="title"
          value={formData.title || ''}
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
          value={formData.slug || ''}
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
          value={formData.description || ''}
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
          value={formData.content || ''}
          onChange={handleEditorChange}
          placeholder="ใส่เนื้อหาบทความของคุณที่นี่..."
        />
        {errors.content && <span className="text-error text-sm mt-1">{errors.content}</span>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ภาพปก */}
        <FeaturedImageField 
          value={formData.featured_image || ''} 
          onClick={openImageSelector}
          errorMessage={errors.featured_image}
        />
        
        <div className="space-y-6">
          {/* หมวดหมู่ */}
          <CategoriesSelect 
            categories={categories} 
            value={formData.category_id || ''} 
            onChange={handleChange} 
          />
          
          {/* สถานะ */}
          <StatusSelect 
            value={formData.status || 'draft'} 
            onChange={handleChange} 
          />
          
          {/* ข้อมูลเพิ่มเติม (สำหรับการแก้ไข) */}
          {isEdit && post && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">ข้อมูลเพิ่มเติม</span>
              </label>
              <div className="bg-base-200 p-4 rounded-md text-sm space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {post.id}
                </p>
                <p>
                  <span className="font-semibold">ยอดเข้าชม:</span> {post.views || 0}
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
          )}
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
            isEdit ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกบทความ'
          }
        </button>
      </div>
    </form>
  );
};

export default PostForm;