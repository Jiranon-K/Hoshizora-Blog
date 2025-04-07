'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginForm = () => {
  
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const [isLoaded, setIsLoaded] = useState(false);
  
  const router = useRouter();

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  
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
        setError(data.message || 'การเข้าสู่ระบบไม่สำเร็จ');
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
    <div className="min-h-screen flex items-center justify-center bg-neutral bg-opacity-90 relative overflow-hidden">
     
      
      
     
      
      
      
      <div className="absolute -left-24 top-1/4 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -right-24 top-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-24 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

     
      <div className={`card w-96 bg-neutral-900 shadow-xl relative z-10 border border-neutral-800 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"></div>
        
       
        <div className="pt-10 px-8 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-500">Admin Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </h2>
          <p className="text-white text-sm text-center mb-6">กรุณาเข้าสู่ระบบเพื่อจัดการเนื้อหาของคุณ</p>
        </div>
        
       
        {error && (
          <div className="mx-8 mb-4 px-4 py-3 rounded-lg bg-red-50 border-l-4 border-red-400 flex items-center space-x-3 animate-fadeIn">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}
        
       
        <form onSubmit={handleSubmit} className="space-y-5 p-8 pt-0">
          
          <div className="form-control w-full relative group">
            <label className="label pb-0">
              <span className="label-text text-white">ชื่อผู้ใช้หรืออีเมล</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="input w-full bg-white border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all pr-10 group-hover:border-indigo-300"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          
          <div className="form-control w-full relative group">
            <label className="label pb-0">
              <span className="label-text text-white">รหัสผ่าน</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input w-full bg-white border border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all pr-10 group-hover:border-indigo-300"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
         
          <div className="form-control mt-8">
            <button
              type="submit"
              disabled={loading}
              className="btn relative overflow-hidden group bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 border-0 text-white hover:opacity-90 transition-all duration-300"
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              {loading ? (
                <div className="flex items-center justify-center">
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>เข้าสู่ระบบ</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
        
        
        <div className="border-t border-gray-100 p-6">
          <div className="text-center">
            <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-700 inline-flex items-center group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>กลับไปยังหน้าหลัก</span>
            </Link>
          </div>
        </div>
      </div>
      
     
      <div className={`absolute bottom-4 text-center w-full text-gray-400 text-xs transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        © {new Date().getFullYear()} Hoshizora Blog. All rights reserved.
      </div>
    </div>
  );
};

export default LoginForm;