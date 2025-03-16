'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  
  
  const [error, setError] = useState('');
  
  
  const [loading, setLoading] = useState(false);
  
  
  const router = useRouter();

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true); 

    try {
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

     
      const data = await response.json();

      
      if (!data.success) {
        setError(data.message || 'การล็อกอินไม่สำเร็จ');
        setLoading(false);
        return;
      }

     
      localStorage.setItem('blog_user', JSON.stringify(data.user));

     
      router.push('/admin');
      
    } catch (error) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบผู้ดูแล</h1>
        
       
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block text-gray-700 mb-2">
              ชื่อผู้ใช้หรืออีเมล
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
         
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;