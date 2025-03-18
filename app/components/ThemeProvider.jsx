'use client';

import React, { useEffect, useState } from 'react';

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'lofi';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  if (!mounted) {
    return <div data-theme="lofi">{children}</div>;
  }

  return <>{children}</>;
}