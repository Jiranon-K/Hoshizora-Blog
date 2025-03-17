'use client';
import { useState } from 'react';

export default function DebugPage() {
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  
  async function checkDebug() {
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError(error.message);
    }
  }
  
  async function uploadTest() {
    if (!file) {
      alert('กรุณาเลือกไฟล์ก่อน');
      return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setResult(data);
      } catch (e) {
        setResult({ rawResponse: text, status: response.status });
      }
    } catch (error) {
      setError(error.message);
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ดีบักระบบอัปโหลด</h1>
      
      <div className="mb-4">
        <button 
          onClick={checkDebug}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ตรวจสอบระบบ
        </button>
      </div>
      
      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl mb-2">ทดสอบอัปโหลด</h2>
        <input 
          type="file" 
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button
          onClick={uploadTest}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          อัปโหลดไฟล์ทดสอบ
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          <h3 className="font-bold">เกิดข้อผิดพลาด:</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">ผลลัพธ์:</h3>
          <pre className="whitespace-pre-wrap overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}