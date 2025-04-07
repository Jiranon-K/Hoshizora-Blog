'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted state first to ensure client-side rendering is active
    setMounted(true);
    
    // Safely access localStorage only on the client side
    try {
      const savedTheme = localStorage.getItem('theme') || 'lofi';
      document.documentElement.setAttribute('data-theme', savedTheme);
    } catch (error) {
      // Fallback if localStorage is unavailable
      document.documentElement.setAttribute('data-theme', 'lofi');
    }
  }, []);

  // Return the same structure whether mounted or not to avoid hydration mismatches
  return <div suppressHydrationWarning>{children}</div>;
}