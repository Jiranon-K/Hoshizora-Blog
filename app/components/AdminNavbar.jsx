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
    <nav className="bg-black border-b border-zinc-800 text-white font-light">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
         
          <div className="flex items-center">
            <Link href="/" className="text-xl font-light tracking-tight hover:text-zinc-300 transition-colors">
              Hoshizora <span className="text-zinc-500 font-normal text-xs uppercase tracking-widest ml-1">Admin</span>
            </Link>
          </div>

          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/admin" 
              className={`py-2 px-4 rounded text-sm transition-all duration-200 ${isActive('/admin') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
            >
              แดชบอร์ด
            </Link>
            <Link 
              href="/admin/posts" 
              className={`py-2 px-4 rounded text-sm transition-all duration-200 ${isActive('/admin/posts') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
            >
              บทความ
            </Link>
            <Link 
              href="/admin/categories" 
              className={`py-2 px-4 rounded text-sm transition-all duration-200 ${isActive('/admin/categories') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/admin/users" 
              className={`py-2 px-4 rounded text-sm transition-all duration-200 ${isActive('/admin/users') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-950'}`}
            >
              ผู้ใช้
            </Link>
            
            <div className="w-px h-4 bg-zinc-800 mx-3"></div>
            
            {user && (
              <div className="flex items-center ml-1">
                {/* <div className="mr-3 flex items-center gap-3">
                  <img 
                    src={user.avatar || '/avatar/default.webp'} 
                    alt={user.display_name} 
                    className="w-8 h-8 rounded-full border border-zinc-800"
                  />
                   <div className="text-sm hidden lg:block">
                    <div className="leading-none mb-1">{user.display_name}</div>
                    <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{user.role}</div>
                  </div>
                </div> */}
               
                <button 
                  onClick={onLogout}
                  className="py-1.5 px-3 border border-zinc-800 bg-zinc-950 rounded text-xs text-zinc-400 hover:text-red-400 hover:border-red-900 hover:bg-red-950/20 transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none hover:text-zinc-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-900 pt-4">
            <Link 
              href="/admin" 
              className={`block py-3 px-4 rounded transition-colors ${isActive('/admin') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'}`}
            >
              แดชบอร์ด
            </Link>
            <Link 
              href="/admin/posts" 
              className={`block py-3 px-4 rounded transition-colors ${isActive('/admin/posts') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'}`}
            >
              บทความ
            </Link>
            <Link 
              href="/admin/categories" 
              className={`block py-3 px-4 rounded transition-colors ${isActive('/admin/categories') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'}`}
            >
              หมวดหมู่
            </Link>
            <Link 
              href="/admin/users" 
              className={`block py-3 px-4 rounded transition-colors ${isActive('/admin/users') ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'}`}
            >
              ผู้ใช้
            </Link>
            
            {user && (
              <div className="mt-4 pt-4 border-t border-zinc-900">
                <div className="flex items-center px-4 py-2">
                  <img 
                    src={user.avatar || '/avatar/default.webp'} 
                    alt={user.display_name} 
                    className="w-8 h-8 rounded-full mr-3 border border-zinc-800"
                  />
                  <div>
                    <div className="text-sm text-white">{user.display_name}</div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider">{user.role}</div>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full mt-2 py-3 px-4 border border-zinc-800 bg-zinc-950 rounded text-center text-zinc-400 text-sm hover:text-red-400 hover:bg-red-950/20 hover:border-red-900 transition-colors"
                >
                  Sign Out
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