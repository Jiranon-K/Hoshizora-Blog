import React from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/helpers';

export default function PostImage({ image, title }) {
  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-md relative h-[400px]">
      <Image
        src={getImageUrl(image)}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover"
        quality={85}
        priority
      />
    </div>
  );
}