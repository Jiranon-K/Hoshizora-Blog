'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/helpers';

const getCategoryColors = (category) => {
  const normalizedCategory = (category || '').toLowerCase();
  
  const colorMap = {
    'anime': 'text-pink-400 bg-pink-500/20',
    'novel': 'text-purple-400 bg-purple-500/20',
    'visual': 'text-blue-400 bg-blue-500/20',
    'game': 'text-amber-400 bg-amber-500/20'
  };

  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedCategory.includes(key)) return value;
  }
  
  return 'text-emerald-400 bg-emerald-500/20';
};

const PostCard = ({ title, description, category, date, author, image, slug }) => {
  const categoryColor = getCategoryColors(category);
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <figure className="relative overflow-hidden h-56">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
        
        <div className="absolute top-4 left-4 z-10">
          <span className={`badge badge-soft ${
              categoryColor === 'text-pink-400 bg-neutral-950' ? 'badge-secondary' :
              categoryColor === 'text-purple-400 bg-neutral-950' ? 'badge-secondary' :
              categoryColor === 'text-blue-400 bg-neutral-950' ? 'badge-secondary' :
              categoryColor === 'text-amber-400 bg-neutral-950' ? 'badge-secondary' :
              'badge-error'
            }`}>
            {category}
          </span>
        </div>
      </figure>

      <div className="card-body">
        <h3 className="card-title text-primary hover:text-primary-focus transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-base-content/70 line-clamp-3 flex-grow">
          {description}
        </p>
        
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-content/10">
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img 
                  src={getImageUrl(typeof author === 'object' ? author.avatar : '/avatar/Aharen-san.webp')} 
                  alt={typeof author === 'object' ? author.display_name : author}
                />
              </div>
            </div>
            <div>
              <p className="font-medium text-base-content">
                {typeof author === 'object' ? author.display_name : author}
              </p>
              <p className="text-xs text-base-content/50">{date}</p>
            </div>
          </div>
          
          <Link 
            href={`/blog/${slug}`} 
            className="btn btn-primary btn-sm"
          >
            อ่านต่อ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
       
        const latestPosts = data
          .filter(post => post.status === 'published')
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
          .slice(0, 6);
        
        setPosts(latestPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-base-200 rounded-xl p-8 shadow-inner">
        <div className="text-primary text-6xl mb-4">📭</div>
        <h3 className="text-xl font-bold mb-2">ยังไม่มีบทความ</h3>
        <p className="text-base-content/70">กลับมาเร็วๆ นี้เพื่อติดตามเนื้อหาที่น่าตื่นเต้น!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-base-content">บทความล่าสุด</h2>
        <Link 
          href="/blog" 
          className="btn btn-outline btn-primary"
        >
          บทความทั้งหมด
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard
            key={post.id}
            title={post.title}
            description={post.description}
            category={post.category_name}
            date={new Date(post.published_at).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            author={post.author}
            image={post.featured_image}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  );
}