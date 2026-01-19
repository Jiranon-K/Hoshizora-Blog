import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/helpers';

export default function PostImage({ image, title }) {
  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] mb-10">
      {/* Hero Image Container */}
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden group">
        {/* Image with hover zoom */}
        <Image
          src={getImageUrl(image)}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          quality={100}
          priority
        />
        
        {/* Cinematic Gradient Overlay - Bottom fade */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.1) 50%, transparent 70%)'
          }}
        />
        
        {/* Top subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%)'
          }}
        />
        
        {/* Side vignettes for cinematic feel */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.4)'
          }}
        />
      </div>
    </div>
  );
}