"use client";

import React, { useState } from "react";
import { FaEnvelope, FaFacebook, FaTimes, FaBars } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar bg-base-100 backdrop-blur-2xl shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <a className="btn btn-ghost normal-case md:text-2xl text-lg" href="/">
            HOSHIZORA BLOG
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="/" className="px-3 py-2 hover:bg-base-200 rounded-lg">Home</a>
            <a href="/blog" className="px-3 py-2 hover:bg-base-200 rounded-lg">ALL BLOG</a>
            <button 
              className="btn btn-neutral ml-2"
              onClick={() => document.getElementById('contact_modal').showModal()}
            >
              Contact
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="btn btn-ghost md:hidden" 
            onClick={toggleMenu}
          >
            <FaBars size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-md z-40">
          <div className="flex flex-col p-4">
            <a 
              href="/" 
              className="px-3 py-2 hover:bg-base-200 rounded-lg"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a 
              href="/blog" 
              className="px-3 py-2 hover:bg-base-200 rounded-lg"
              onClick={toggleMenu}
            >
              ALL BLOG
            </a>
            <button 
              className="btn btn-neutral mt-2"
              onClick={() => {
                toggleMenu();
                document.getElementById('contact_modal').showModal();
              }}
            >
              Contact
            </button>
          </div>
        </div>
      )}

      {/* Modal Contact */}
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
    </div>
  );
};

export default Navbar;