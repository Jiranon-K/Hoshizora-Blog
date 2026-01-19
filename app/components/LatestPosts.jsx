import React from 'react';
import Link from 'next/link';
import Image from 'next/image';  
import { connectToDatabase } from '@/lib/db';
import Post from '@/lib/models/Post';
import { getImageUrl } from '@/lib/helpers';
import { unstable_noStore as noStore } from 'next/cache';

async function getLatestPosts() {
  noStore(); 
  
  try {
    await connectToDatabase();
    
    const posts = await Post.find({ status: 'published' })
      .populate('user', 'displayName title avatar')
      .populate('category', 'name slug')
      .select('id title description featuredImage publishedAt slug')
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean();

    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      image: post.featuredImage,
      date: new Date(post.publishedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      category_name: post.category?.name || null,
      author: post.user?.displayName || null,
      authorTitle: post.user?.title || null,
      authorAvatar: post.user?.avatar || null,
      slug: post.slug
    }));
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

function PostCard({ title, description, category, date, author, image, slug }) {
  const categoryColor = getCategoryColors(category);
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <figure className="relative overflow-hidden h-56">
        <div className="relative w-full h-full">
          <Image
            src={getImageUrl(image)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
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
        <h3 className="card-title text-base-content hover:text-primary-focus transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-base-content/70 line-clamp-3 flex-grow">
          {description}
        </p>
        
        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-content/10">
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <Image 
                  src={getImageUrl(typeof author === 'object' ? author.avatar : '/avatar/Aharen-san.webp')} 
                  alt={typeof author === 'object' ? author.display_name : author}
                  width={40}
                  height={40}
                  className="rounded-full"
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
}

function getCategoryColors(category) {
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
}

export default async function LatestPosts() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="skeleton h-9 w-40"></div>
          <div className="skeleton h-12 w-36 rounded-lg"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              {/* Image skeleton */}
              <figure className="relative h-56">
                <div className="skeleton w-full h-full"></div>
                <div className="absolute top-4 left-4">
                  <div className="skeleton h-5 w-16 rounded-full"></div>
                </div>
              </figure>

              <div className="card-body">
                {/* Title skeleton */}
                <div className="skeleton h-6 w-full mb-2"></div>
                <div className="skeleton h-6 w-3/4"></div>
                
                {/* Description skeleton */}
                <div className="skeleton h-4 w-full mt-4"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-2/3"></div>
                
                {/* Footer skeleton */}
                <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-content/10">
                  <div className="flex items-center space-x-3">
                    <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
                    <div>
                      <div className="skeleton h-4 w-24 mb-1"></div>
                      <div className="skeleton h-3 w-20"></div>
                    </div>
                  </div>
                  <div className="skeleton h-8 w-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            date={post.date}
            author={post.author}
            image={post.image}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  );
}