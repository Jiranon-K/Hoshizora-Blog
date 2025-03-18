import React from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/helpers';

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) return null;
  
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">บทความที่เกี่ยวข้อง</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map(related => (
          <Link href={`/blog/${related.slug}`} key={related.id} className="flex">
            <div className="bg-base-content/5 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full w-full">
              <div className="h-40 overflow-hidden">
                <img
                  src={getImageUrl(related.image)}
                  alt={related.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-lg font-medium line-clamp-2">{related.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}