'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CategoriesSelect from '../components/CategoriesSelect';
import StatusSelect from './StatusSelect';
import FeaturedImageField from '../components/FeaturedImageField';
import { ArrowLeft } from 'lucide-react';

const RichTextEditor = dynamic(() => import('../../components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-zinc-900 animate-pulse rounded-lg"></div>
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
    <form onSubmit={handleSubmit} className="min-h-screen text-zinc-100 pb-20">
      
      {/* Top Action Bar */}
      <div className="sticky top-[64px] z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4 mb-8 -mx-6 -mt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="btn btn-circle btn-ghost btn-sm text-zinc-400 hover:bg-zinc-900 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-medium text-zinc-100">
              {isEdit ? 'แก้ไข' : 'สร้าง'}
            </h1>
            <p className="text-xs text-zinc-500">
              {isEdit && post ? (post.status === 'published' ? 'เผยแพร่' : 'ร่าง') : 'ใหม่'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="btn btn-ghost text-zinc-400 hover:bg-zinc-900 hover:text-white font-normal btn-sm">
            ยกเลิก
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary bg-white text-black hover:bg-zinc-200 border-none btn-sm px-6 font-medium"
            disabled={submitting}
          >
            {submitting ? (
              <><span className="loading loading-spinner loading-xs"></span> Saving...</>
            ) : (
              isEdit ? 'อัปเดต' : 'เผยแพร่'
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-[1600px] mx-auto">
        
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Title Input */}
          <div className="space-y-2">
            <input 
              type="text" 
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className={`w-full bg-transparent text-4xl font-bold text-white placeholder-zinc-700 border-none outline-none focus:ring-0 p-0 ${errors.title ? 'text-red-400' : ''}`}
              placeholder="Enter post title here..."
              autoFocus
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          {/* Editor */}
          <div className="min-h-[500px] bg-zinc-900/30 rounded-lg border border-zinc-800/50 p-1">
             <RichTextEditor
               value={formData.content || ''}
               onChange={handleEditorChange}
               placeholder="Write your story..."
             />
             {errors.content && <span className="text-red-500 text-sm mt-2 block px-2">{errors.content}</span>}
          </div>

          {/* Excerpt Section */}
          <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800/50">
            <div className="form-control w-full">
              <label className="label px-0 mb-2">
                <span className="label-text text-zinc-100 font-medium text-lg">เรื่องย่อ</span>
              </label>
              <textarea 
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className={`textarea textarea-bordered w-full h-24 bg-zinc-950 border-zinc-800 focus:border-zinc-600 focus:outline-none text-zinc-300 ${errors.description ? 'textarea-error' : ''}`}
                placeholder="A short description for SEO and previews..."
              ></textarea>
              {errors.description && <span className="text-red-500 text-sm mt-1">{errors.description}</span>}
            </div>
          </div>

        </div>

        {/* Sidebar (Right) - Settings */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Publishing Panel */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/50 space-y-5">
            <h3 className="font-medium text-zinc-200 border-b border-zinc-800 pb-2">การเผยแพร่</h3>
            
            <StatusSelect 
              value={formData.status || 'draft'} 
              onChange={handleChange} 
            />

            <CategoriesSelect 
              categories={categories} 
              value={formData.category_id || ''} 
              onChange={handleChange} 
            />
          </div>

          {/* Featured Image Panel */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/50 space-y-4">
             <h3 className="font-medium text-zinc-200 border-b border-zinc-800 pb-2">รูปภาพ</h3>
             <FeaturedImageField 
               value={formData.featured_image || ''} 
               onClick={openImageSelector}
               errorMessage={errors.featured_image}
             />
          </div>

          {/* URL / Slug Panel */}
          <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/50 space-y-4">
            <h3 className="font-medium text-zinc-200 border-b border-zinc-800 pb-2">Permalink</h3>
            <div className="form-control w-full">
               <label className="label px-0">
                 <span className="label-text text-zinc-400 font-medium text-xs">SLUG</span>
               </label>
               <input 
                 type="text" 
                 name="slug"
                 value={formData.slug || ''}
                 onChange={handleChange}
                 className={`input input-sm input-bordered w-full bg-zinc-950 border-zinc-800 text-zinc-300 focus:border-zinc-600 ${errors.slug ? 'input-error' : ''}`}
                 placeholder="my-post-slug"
               />
               {errors.slug && <span className="text-red-500 text-xs mt-1">{errors.slug}</span>}
               <div className="mt-2 text-[10px] text-zinc-500 break-all">
                 Preview: <span className="text-zinc-400">/blog/{formData.slug || '...'}</span>
               </div>
            </div>
          </div>

          {/* Metadata (Edit only) */}
          {isEdit && post && (
            <div className="bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/50 space-y-3">
               <h3 className="font-medium text-zinc-200 border-b border-zinc-800 pb-2">Post Stats</h3>
               <div className="text-xs space-y-2 text-zinc-400">
                 <div className="flex justify-between">
                   <span>Views:</span> <span className="text-zinc-200">{post.views || 0}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Created:</span> <span className="text-zinc-200">{post?.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Updated:</span> <span className="text-zinc-200">{post?.updated_at ? new Date(post.updated_at).toLocaleDateString() : '-'}</span>
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </form>
  );
};

export default PostForm;