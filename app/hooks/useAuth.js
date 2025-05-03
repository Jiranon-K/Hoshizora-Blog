'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if session is valid
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/check-session', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (!data.valid) {
        // Session expired or invalid
        localStorage.removeItem('blog_user');
        toast.error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง');
        router.push('/login?expired=true');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session check error:', error);
      return false;
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('blog_user');
    
    if (!userData) {
      router.push('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Verify session is still valid with backend
      checkSession();
      
      // Set up interval to periodically check session
      const sessionCheckInterval = setInterval(checkSession, 15 * 60 * 1000); // Check every 15 minutes
      
      return () => clearInterval(sessionCheckInterval);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.removeItem('blog_user');
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('เกิดข้อผิดพลาดในการออกจากระบบ');
    }
  };

  return { user, loading, handleLogout, checkSession };
}