"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FaEnvelope, 
  FaFacebook, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaBook, 
  FaRegClock, 
  FaHeadphonesAlt 
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const pathname = usePathname();

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { title: "หน้าแรก", href: "/", icon: <FaHome /> },
    { title: "บทความ", href: "/blog", icon: <FaBook /> },
    { title: "อนิเมะล่าสุด", href: "/blog?category=anime", icon: <FaRegClock /> },
    { title: "วิชวลโนเวล", href: "/blog?category=visual-novel", icon: <FaHeadphonesAlt /> }
  ];

  
  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
      ? "bg-white/95 backdrop-blur-md shadow-md py-2" 
      : "bg-white py-4"
    }`}>
     
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"></div>
      
      
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#6b46c1_0.8px,transparent_0.8px)] bg-[size:12px_12px]"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
         
          <Link 
            href="/" 
            className="relative group"
            onMouseEnter={() => setHoverItem('logo')}
            onMouseLeave={() => setHoverItem(null)}
          >
            <div className="flex items-center space-x-2">
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                Hoshizora
              </span>
              <span className="relative px-2 py-0.5 text-xs bg-pink-500 text-white rounded-md font-bold tracking-wider overflow-hidden">
                <span className="relative z-10">BLOG</span>
                {hoverItem === 'logo' && (
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"></span>
                )}
              </span>
            </div>
            
          
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${hoverItem === 'logo' ? 'w-full' : ''}`}></span>
          </Link>

         
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className={`relative px-3 py-2 rounded-lg flex items-center space-x-1 font-medium transition-all duration-300 overflow-hidden ${
                  isActive(item.href)
                  ? "text-white" 
                  : "text-gray-700 hover:text-purple-600"
                }`}
                onMouseEnter={() => setHoverItem(item.title)}
                onMouseLeave={() => setHoverItem(null)}
              >
              
                {isActive(item.href) && (
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 -z-10"></span>
                )}
                
               
                {!isActive(item.href) && hoverItem === item.title && (
                  <span className="absolute inset-0 bg-purple-100 -z-10 animate-pulse"></span>
                )}
                
                <span className="text-sm">{item.icon}</span>
                <span>{item.title}</span>
                
               
                {hoverItem === item.title && (
                  <span className="absolute top-0 -right-1 h-full w-4 bg-white/30 skew-x-[30deg] transform transition-all duration-300"></span>
                )}
              </Link>
            ))}
            
            <button 
              className="relative overflow-hidden ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
              onClick={() => document.getElementById('contact_modal').showModal()}
            >
              <span className="flex items-center space-x-1">
                <FaEnvelope className="text-sm" />
                <span>ติดต่อ</span>
              </span>
              
              
              <span className="absolute -top-1 -right-1 w-8 h-8 bg-white/20 rounded-full transform scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 delay-100"></span>
            </button>
          </div>

         
          <button 
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-purple-100 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes size={20} className="text-purple-600" />
            ) : (
              <FaBars size={20} />
            )}
            
            
            <span className="absolute inset-0 rounded-lg bg-purple-200/50 transform scale-0 opacity-0 transition-all duration-300 hover:scale-100 hover:opacity-100"></span>
          </button>
        </div>
      </div>

      {/* เมนูมือถือ */}
      <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}>
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <Link href="/" className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600" onClick={closeMenu}>
              Hoshizora Blog
            </Link>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="p-4 flex-1">
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                    : "hover:bg-purple-50 text-gray-700"
                  }`}
                  onClick={closeMenu}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-4 border-t">
            <button 
              onClick={() => {
                document.getElementById('contact_modal').showModal();
                closeMenu();
              }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2"
            >
              <FaEnvelope />
              <span>ติดต่อเรา</span>
            </button>
            
            <div className="flex justify-center space-x-4 mt-6">
              <a 
                href="mailto:jiranon46@gmail.com"
                className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
              <a 
                href="https://facebook.com/facebook-page" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      
      <dialog id="contact_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white relative p-4 sm:p-6">
          <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700">
                <FaTimes size={20} />
              </button>
            </form>
          </div>
          
          <h3 className="font-bold text-xl mt-2 mb-5 sm:mb-6 text-center">ติดต่อเรา</h3>
          
          <div className="space-y-4 sm:space-y-5">
            <div className="w-full">
              <a 
                href="mailto:jiranon46@gmail.com" 
                className="btn btn-outline btn-primary h-auto py-3 px-4 flex items-center justify-center w-full text-sm sm:text-base"
              >
                <FaEnvelope size={18} className="mr-2 flex-shrink-0" /> 
                <span className="text-left overflow-hidden text-ellipsis">jiranon46@gmail.com</span>
              </a>
            </div>
            
            <div className="w-full">
              <a 
                href="https://facebook.com/facebook-page" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-primary h-auto py-3 px-4 flex items-center justify-center w-full text-sm sm:text-base"
              >
                <FaFacebook size={18} className="mr-2 flex-shrink-0" /> 
                <span className="text-left overflow-hidden text-ellipsis">Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default Navbar;