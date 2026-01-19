'use client';

import React, { useEffect, useRef } from 'react';
import { getImageUrl } from '@/lib/helpers';
import useImageUpload from '../../hooks/useImageUpload';

const ImageSelectorModal = ({ isOpen, onClose, onSelectImage }) => {
  const fileInputRef = useRef(null);
  const {
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
  } = useImageUpload();
  
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-lg font-semibold text-white">เลือกรูปภาพ</h3>
        </div>
        
        {/* Upload Section */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <h4 className="font-medium mb-3 text-zinc-300 text-sm uppercase tracking-wider">อัปโหลดใหม่</h4>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full bg-zinc-950 border-zinc-800 text-zinc-300 focus:outline-none"
                ref={fileInputRef}
              />
              <button
                onClick={handleUpload}
                disabled={!uploadFile || uploading}
                className="btn btn-primary mt-3 w-full bg-white text-black hover:bg-zinc-200 border-none disabled:bg-zinc-800 disabled:text-zinc-500"
              >
                {uploading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Uploading...
                  </>
                ) : (
                  'อัปโหลดรูปภาพ'
                )}
              </button>
            </div>
            
            {/* Preview */}
            {previewUrl && (
              <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Gallery Section */}
        <div className="p-4 flex-1 overflow-y-auto bg-zinc-900">
          <h4 className="font-medium mb-3 text-zinc-300 text-sm uppercase tracking-wider">Library</h4>
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          ) : images.length === 0 ? (
            <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-lg p-12 text-center text-zinc-500">
              ไม่พบรูปภาพ
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.url}
                  onClick={() => onSelectImage(image.url)}
                  className="aspect-square border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-white hover:ring-2 hover:ring-white/20 transition-all group relative"
                >
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 truncate text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-zinc-800 bg-zinc-900">
          <button onClick={onClose} className="btn btn-ghost w-full hover:bg-zinc-800 text-zinc-400 font-normal">
           ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;