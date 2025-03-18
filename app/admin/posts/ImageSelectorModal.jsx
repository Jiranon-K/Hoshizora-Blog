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
    <div className="fixed inset-0 bg-neutral/50 z-50 flex items-center justify-center p-4">
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
                ref={fileInputRef}
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
                    src={getImageUrl(image.url)}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <button onClick={onClose} className="btn btn-neutral w-full">
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageSelectorModal;