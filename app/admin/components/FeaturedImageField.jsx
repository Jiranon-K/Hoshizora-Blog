'use client';

import React from 'react';
import { getImageUrl } from '@/lib/helpers';

const FeaturedImageField = ({ value, onClick, errorMessage }) => {
  return (
    <div className="form-control w-full group">
      <label className="label px-0">
        <span className="label-text text-zinc-400 font-medium">รูปภาพ</span>
      </label>
      
      <div className="border-2 border-dashed border-zinc-800 rounded-lg p-4 text-center hover:border-zinc-600 transition-colors cursor-pointer bg-zinc-900/30"
           onClick={onClick}>
        {value ? (
          <div className="relative w-full aspect-video rounded overflow-hidden">
            <img 
              src={getImageUrl(value)} 
              alt="Featured" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
                e.target.alt = 'Image load failed';
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-medium">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <span>เลือกรูปภาพ</span>
          </div>
        )}
      </div>
      
      <input type="hidden" name="featured_image" value={value || ''} />
      
      {errorMessage && <span className="text-red-500 text-xs mt-2 block">{errorMessage}</span>}
    </div>
  );
};

export default FeaturedImageField;