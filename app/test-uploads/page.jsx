'use client';

import React, { useState, useEffect } from 'react';

export default function TestUploadsPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [apiResponses, setApiResponses] = useState({});
  
  // เช็คไฟล์ที่อัปโหลดแล้ว
  useEffect(() => {
    async function fetchImages() {
      try {
        setLoading(true);
        const response = await fetch('/api/uploads');
        
        // บันทึก response ตัวจริงเพื่อดีบัก
        try {
          const clonedResponse = response.clone();
          const text = await clonedResponse.text();
          setApiResponses(prev => ({
            ...prev,
            uploads: {
              status: response.status,
              text: text.substring(0, 500) + (text.length > 500 ? '...' : '')
            }
          }));
        } catch (err) {
          console.error("ไม่สามารถอ่าน response text:", err);
        }
        
        if (!response.ok) {
          setError(`API ตอบกลับด้วยสถานะผิดพลาด: ${response.status}`);
          return;
        }
        
        try {
          const data = await response.json();
          if (data.error) {
            setError(data.error);
          } else {
            setImages(data.images || []);
          }
        } catch (jsonError) {
          setError(`การแปลง Response เป็น JSON ล้มเหลว: ${jsonError.message}`);
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดรูปภาพ: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchImages();
  }, []);
  
  // เช็คพาธและสิทธิ์ของโฟลเดอร์
  async function checkPaths() {
    try {
      const response = await fetch('/api/debug-paths');
      
      // บันทึก response ตัวจริงเพื่อดีบัก
      try {
        const clonedResponse = response.clone();
        const text = await clonedResponse.text();
        setApiResponses(prev => ({
          ...prev,
          debugPaths: {
            status: response.status,
            text: text.substring(0, 500) + (text.length > 500 ? '...' : '')
          }
        }));
      } catch (err) {
        console.error("ไม่สามารถอ่าน response text:", err);
      }
      
      if (!response.ok) {
        setError(`API ตอบกลับด้วยสถานะผิดพลาด: ${response.status}`);
        return;
      }
      
      try {
        const data = await response.json();
        setDebugInfo(data);
      } catch (jsonError) {
        setError(`การแปลง Response เป็น JSON ล้มเหลว: ${jsonError.message}`);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการตรวจสอบพาธ: ' + err.message);
    }
  }
  
  // อัปโหลดไฟล์ทดสอบ
  async function uploadTestFile(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('test-file');
    if (!fileInput.files || fileInput.files.length === 0) {
      alert('กรุณาเลือกไฟล์ก่อนอัปโหลด');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      // บันทึก response ตัวจริงเพื่อดีบัก
      try {
        const clonedResponse = response.clone();
        const text = await clonedResponse.text();
        setApiResponses(prev => ({
          ...prev,
          upload: {
            status: response.status,
            text: text.substring(0, 500) + (text.length > 500 ? '...' : '')
          }
        }));
      } catch (err) {
        console.error("ไม่สามารถอ่าน response text:", err);
      }
      
      if (!response.ok) {
        alert(`อัปโหลดล้มเหลว: API ส่งสถานะ ${response.status}`);
        return;
      }
      
      try {
        const data = await response.json();
        if (data.success) {
          alert('อัปโหลดสำเร็จ: ' + data.url);
          // โหลดรายการไฟล์ใหม่
          window.location.reload();
        } else {
          alert('อัปโหลดล้มเหลว: ' + (data.error || 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'));
        }
      } catch (jsonError) {
        alert(`การแปลง Response เป็น JSON ล้มเหลว: ${jsonError.message}`);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปโหลด: ' + err.message);
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ทดสอบระบบอัปโหลดรูปภาพ</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded">
        <h2 className="text-lg font-semibold mb-2">อัปโหลดไฟล์ทดสอบ</h2>
        <form onSubmit={uploadTestFile} className="flex flex-col space-y-2">
          <input 
            type="file" 
            id="test-file" 
            accept="image/*" 
            className="border p-2 rounded" 
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            อัปโหลดไฟล์
          </button>
        </form>
      </div>
      
      <button 
        onClick={checkPaths} 
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4"
      >
        ตรวจสอบพาธและสิทธิ์
      </button>
      
      {/* แสดงผลการตอบกลับของ API เพื่อดีบัก */}
      {Object.keys(apiResponses).length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded overflow-auto">
          <h2 className="text-lg font-semibold mb-2">API Responses (Debug)</h2>
          {Object.entries(apiResponses).map(([key, value]) => (
            <div key={key} className="mb-4">
              <h3 className="text-md font-medium">{key} (Status: {value.status})</h3>
              <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">{value.text}</pre>
            </div>
          ))}
        </div>
      )}
      
      {debugInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded overflow-auto">
          <h2 className="text-lg font-semibold mb-2">ข้อมูลการดีบัก</h2>
          <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded">
          <h2 className="text-lg font-semibold mb-2">เกิดข้อผิดพลาด</h2>
          <p>{error}</p>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-semibold mb-2">รูปภาพที่อัปโหลดแล้ว ({images.length})</h2>
        
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : images.length === 0 ? (
          <p>ไม่พบรูปภาพที่อัปโหลด</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded p-2">
                <img 
                  src={image.url} 
                  alt={image.name}
                  className="w-full h-48 object-cover mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                    e.target.title = `ไม่สามารถโหลดรูปภาพ: ${image.url}`;
                  }}
                />
                <p className="text-sm truncate">{image.name}</p>
                <div className="mt-2">
                  <a 
                    href={image.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    เปิดในแท็บใหม่
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}