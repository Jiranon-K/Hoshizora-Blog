'use client';

import React from 'react';

const DeleteUserModal = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  isDeleting,
  errorMessage,
  userName
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-brightness-75 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg mb-4">ยืนยันการลบผู้ใช้</h3>
        <p className="py-4">
          คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{userName}" การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
            onClick={onClose}
            disabled={isDeleting}
          >
            ยกเลิก
          </button>
          <button 
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังลบ...
              </>
            ) : 'ลบผู้ใช้'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;