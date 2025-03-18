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
    <div className="min-h-screen bg-black flex items-center justify-center">
     
      <div className="absolute inset-0 bg-black bg-[radial-gradient(rgba(120,0,120,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="card w-96 glass shadow-xl relative z-10 border border-neutral-800">
        <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full blur-xl bg-error/30 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full blur-xl bg-primary/30 animate-pulse"></div>
        
        <div className="card-body p-8">
          <h2 className="card-title text-2xl mb-6 text-center font-bold text-white mx-auto">เข้าสู่ระบบผู้ดูแล</h2>
          
          {error && (
            <div className="alert alert-error shadow-lg mb-6 transition-all animate-fadeIn">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-white">ชื่อผู้ใช้หรืออีเมล</span>
              </label>
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
                className="input input-bordered w-full bg-neutral/40 backdrop-blur-sm focus:border-primary transition-all duration-300"
                required
              />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-white">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่าน"
                className="input input-bordered w-full bg-neutral/40 backdrop-blur-sm focus:border-primary transition-all duration-300"
                required
              />
            </div>
            
            <div className="form-control mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary bg-gradient-to-r from-purple-700 to-error hover:opacity-80 transition-all duration-300 shadow-md"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </button>
            </div>
          </form>
          
          <div className="divider text-white my-6">หรือ</div>
          
          <div className="text-center">
            <a href="/" className="link link-hover text-white">กลับไปยังหน้าหลัก</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;