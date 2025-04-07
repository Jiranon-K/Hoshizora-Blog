import React from 'react';
import Link from 'next/link';

export default function Breadcrumbs({ post }) {
  return (
    <div className="mb-6 text-sm">
      <Link href="/">หน้าแรก</Link> /{' '}
      <Link href="/blog">บทความ</Link> /{' '}
      <Link href={`/blog?category=${post.categorySlug}`}>{post.category}</Link> /{' '}
      <span className="text-base-content/50">{post.title}</span>
    </div>
  );
}