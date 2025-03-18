'use client';

import React, { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('lofi');
  const [mounted, setMounted] = useState(false);

 
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'lofi';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'lofi' ? 'luxury' : 'lofi';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full bg-base-200 hover:bg-base-300 transition-colors"
      title={theme === 'lofi' ? 'สลับเป็นธีมมืด' : 'สลับเป็นธีมสว่าง'}
    >
      {theme === 'lofi' ? (
        <FaMoon className="text-base-content" />
      ) : (
        <FaSun className="text-base-content" />
      )}
    </button>
  );
};

export default ThemeSwitcher;