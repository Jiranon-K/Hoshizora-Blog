

'use client';

import React, { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }
    
    setResult(null);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
      
        const img = new Image();
        img.onload = () => {
          setResult(prev => ({...prev, imageLoaded: true}));
        };
        img.onerror = () => {
          setResult(prev => ({...prev, imageLoaded: false}));
        };
        img.src = data.url;
      } else {
        setError(data.error || 'อัปโหลดไม่สำเร็จ');
      }
    } catch (err) {
      setError(err.message);
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ทดสอบอัปโหลดรูปภาพ</h1>
      
      <form onSubmit={handleUpload} className="mb-4">
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2 block"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!file}
        >
          อัปโหลด
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">เกิดข้อผิดพลาด</p>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">ผลลัพธ์:</p>
          <pre className="mt-2 bg-white p-2 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
          
          {result.url && (
            <div className="mt-4">
              <p className="font-bold">ทดสอบแสดงรูปภาพ:</p>
              <img 
                src={result.url} 
                alt="ทดสอบรูปที่อัปโหลด" 
                className="mt-2 max-w-md border rounded"
                onError={() => {
                  setResult(prev => ({...prev, imageLoaded: false}));
                }}
              />
              {result.imageLoaded === false && (
                <p className="text-red-500 mt-2">ไม่สามารถโหลดรูปภาพได้ ตรวจสอบเส้นทางไฟล์</p>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-bold mb-2">ข้อมูลระบบ</h2>
        <p><strong>Working Directory:</strong> {process.cwd()}</p>
        <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
        <p><strong>Browser:</strong> {navigator.userAgent}</p>
      </div>
    </div>
  );
}