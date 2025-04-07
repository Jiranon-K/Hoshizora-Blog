import React from 'react';
import Link from 'next/link';

export default function PostHeader({ post }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-sm text-base-content/50 mb-4">
        <span>{post.date}</span>
        <span className="mx-2">•</span>
        <span>อ่าน {post.views} ครั้ง</span>
      </div>
      
      {/* Category */}
      <div className="mb-6">
        <Link href={`/blog?category=${post.categorySlug}`}>
          <span className="bg-neutral-800/90 text-amber-400 text-xs px-3 py-1 rounded-md">
            {post.category}
          </span>
        </Link>
      </div>
    </div>
  );
}