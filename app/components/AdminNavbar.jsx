'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const AdminNavbar = ({ user, onLogout }) => {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
 
  const router = useRouter();
  
  
  const pathname = usePathname();

  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className="bg-neutral text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
         
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              บล็อกของฉัน
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/admin" 
              className={`py-2 px-3 rounded ${isActive('/admin') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              แดชบอร์ด
            </Link>
            <Link 
              href="/admin/posts" 
              className={`py-2 px-3 rounded ${isActive('/admin/posts') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              บทความ
            </Link>
            <Link 
              href="/admin/categories" 
              className={`py-2 px-3 rounded ${isActive('/admin/categories') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/admin/users" 
              className={`py-2 px-3 rounded ${isActive('/admin/users') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              ผู้ใช้
            </Link>
            
            
            {user && (
              <div className="flex items-center ml-4">
                <div className="mr-4">
                  <img 
                    src={user.avatar || '/avatar/default.webp'} 
                    alt={user.display_name} 
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="mr-4 text-sm">
                  <div>{user.display_name}</div>
                  <div className="text-gray-400 text-xs">{user.role}</div>
                </div>
                <button 
                  onClick={onLogout}
                  className="py-1 px-3 bg-red-600 rounded text-sm hover:bg-red-700"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>

          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link 
              href="/admin" 
              className={`block py-2 px-4 rounded ${isActive('/admin') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              แดชบอร์ด
            </Link>
            <Link 
              href="/admin/posts" 
              className={`block py-2 px-4 rounded ${isActive('/admin/posts') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              บทความ
            </Link>
            <Link 
              href="/admin/categories" 
              className={`block py-2 px-4 rounded ${isActive('/admin/categories') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/admin/users" 
              className={`block py-2 px-4 rounded ${isActive('/admin/users') ? 'bg-green-700' : 'hover:bg-gray-700'}`}
            >
              ผู้ใช้
            </Link>
            
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center px-4 py-2">
                  <img 
                    src={user.avatar || '/avatar/default.webp'} 
                    alt={user.display_name} 
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <div>{user.display_name}</div>
                    <div className="text-gray-400 text-xs">{user.role}</div>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full mt-2 py-2 px-4 bg-red-600 rounded text-center hover:bg-red-700"
                >
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;