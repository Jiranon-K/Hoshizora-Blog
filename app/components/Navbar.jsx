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
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  ];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-zinc-800 ${
      scrolled 
      ? "bg-black/80 backdrop-blur-md py-3" 
      : "bg-black py-5"
    }`}>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          
          <Link 
            href="/" 
            className="group"
          >
            <div className="flex items-center space-x-3">
              <span className="font-light text-2xl tracking-tighter text-white group-hover:text-zinc-300 transition-colors">
                Hoshizora
              </span>
              <span className="px-2 py-0.5 text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400 rounded-full font-medium tracking-widest uppercase">
                BLOG
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className={`text-sm font-light tracking-wide transition-colors duration-200 flex items-center space-x-2 ${
                  isActive(item.href)
                  ? "text-white" 
                  : "text-zinc-500 hover:text-white"
                }`}
              >
                <span>{item.title}</span>
              </Link>
            ))}
            
            <div className="w-px h-4 bg-zinc-800 mx-2"></div>
            
            {/* ThemeSwitcher - Keeping capability but styling might need adjustment if forced dark */}
            <div className="opacity-50 hover:opacity-100 transition-opacity">
                <ThemeSwitcher />
            </div>
            
            <button 
              className="ml-2 px-4 py-1.5 rounded-md border border-zinc-800 bg-zinc-950 text-zinc-300 text-xs font-light hover:bg-zinc-900 hover:text-white hover:border-zinc-700 transition-all duration-300"
              onClick={() => document.getElementById('contact_modal').showModal()}
            >
              <span className="flex items-center space-x-2">
                <FaEnvelope className="text-[10px]" />
                <span>CONTACT</span>
              </span>
            </button>
          </div>

          <button 
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-zinc-900 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes size={18} />
            ) : (
              <FaBars size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black z-40 transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      } md:hidden`}>
        <div className="h-full flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b border-zinc-800">
             <Link href="/" className="font-light text-xl tracking-tighter text-white" onClick={closeMenu}>
              Hoshizora
            </Link>
            <button 
              onClick={closeMenu}
              className="p-2 rounded-full hover:bg-zinc-900 text-zinc-400 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
          
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {menuItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                    ? "bg-zinc-900 text-white border border-zinc-800" 
                    : "text-zinc-500 hover:bg-zinc-950 hover:text-zinc-300"
                  }`}
                  onClick={closeMenu}
                >
                  <span className="text-lg opacity-70">{item.icon}</span>
                  <span className="font-light text-lg">{item.title}</span>
                </Link>
              ))}
              
              <div className="pt-6 mt-6 border-t border-zinc-900">
                <div className="flex items-center justify-between p-3 text-zinc-500">
                    <span className="font-light">Theme</span>
                    <ThemeSwitcher />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto p-6 border-t border-zinc-800">
            <button 
              onClick={() => {
                document.getElementById('contact_modal').showModal();
                closeMenu();
              }}
              className="w-full p-4 rounded-none border border-zinc-800 bg-zinc-950 text-white font-light uppercase tracking-widest hover:bg-zinc-900 transition-colors"
            >
              Contact Us
            </button>
            
            <div className="flex justify-center space-x-6 mt-8">
              <a 
                href="mailto:jiranon46@gmail.com"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <FaEnvelope size={20} />
              </a>
              <a 
                href="https://facebook.com/facebook-page" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <FaFacebook size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <dialog id="contact_modal" className="modal modal-bottom sm:modal-middle backdrop:bg-black/90">
        <div className="modal-box bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl relative p-6">
          <div className="absolute right-4 top-4">
            <form method="dialog">
              <button className="text-zinc-500 hover:text-white transition-colors">
                <FaTimes size={18} />
              </button>
            </form>
          </div>
          
          <h3 className="font-light text-2xl mb-8 text-center text-white tracking-tight">CONTACT US</h3>
          
          <div className="space-y-4">
            <div className="w-full">
              <a 
                href="mailto:jiranon46@gmail.com" 
                className="flex items-center justify-center w-full py-3 px-4 border border-zinc-800 bg-black text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-300"
              >
                <FaEnvelope size={16} className="mr-3" /> 
                <span className="font-light">jiranon46@gmail.com</span>
              </a>
            </div>
            
            <div className="w-full">
              <a 
                href="https://facebook.com/facebook-page" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center w-full py-3 px-4 border border-zinc-800 bg-black text-zinc-300 hover:border-zinc-500 hover:text-white transition-all duration-300"
              >
                <FaFacebook size={16} className="mr-3" /> 
                <span className="font-light">Facebook Page</span>
              </a>
            </div>
          </div>
        </div>
      </dialog>
    </nav>
  );
};

export default Navbar;