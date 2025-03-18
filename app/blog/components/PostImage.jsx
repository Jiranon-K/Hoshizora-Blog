import React from 'react';
import { getImageUrl } from '@/lib/helpers';

export default function PostImage({ image, title }) {
  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-md">
      <img
        src={getImageUrl(image)}
        alt={title}
        className="w-full h-auto object-cover"
      />
    </div>
  );
}