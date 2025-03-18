'use client';

import React from 'react';
import Navbar from '../components/Navbar';

export default function BlogLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}