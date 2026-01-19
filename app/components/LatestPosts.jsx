import React from 'react';
import Link from 'next/link';
import Image from 'next/image';  
import { connectToDatabase } from '@/lib/db';
import Post from '@/lib/models/Post';
import '@/lib/models/Category';
import '@/lib/models/User';
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

function PostCard({ title, description, category, date, author, authorAvatar, image, slug }) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full"> 
      <div className="bg-zinc-950 h-full border border-zinc-900 transition-all duration-300 hover:border-zinc-700 flex flex-col pt-0">
        <figure className="relative overflow-hidden h-56 border-b border-zinc-900">
          <Image
            src={getImageUrl(image)}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
          />
          
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-black/80 backdrop-blur-sm text-zinc-300 text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-800">
              {category}
            </span>
          </div>
        </figure>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-light text-white mb-3 tracking-tight group-hover:text-zinc-200 transition-colors line-clamp-2">
            {title}
          </h3>
          
          <p className="text-sm text-zinc-500 font-light mb-6 line-clamp-3 leading-relaxed flex-grow">
            {description}
          </p>
          
          <div className="flex items-center mt-auto pt-4 border-t border-zinc-900">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-800">
                <Image 
                  src={getImageUrl(authorAvatar || '/avatar/default.webp')} 
                  alt={author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-light text-zinc-300">
                  {author}
                </p>
                <p className="text-[10px] text-zinc-600">{date}</p>
              </div>
            </div>
            
            <div className="ml-auto">
               <span className="text-xs text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">อ่านต่อ</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function LatestPosts() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12 animate-pulse">
           <div className="h-8 w-48 bg-zinc-900 rounded"></div>
           <div className="h-10 w-36 bg-zinc-900 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, index) => (
             <div key={index} className="bg-zinc-950 border border-zinc-900 h-96 flex flex-col">
                <div className="h-56 bg-zinc-900 w-full mb-4"></div>
                <div className="p-6 flex-grow">
                     <div className="h-6 w-3/4 bg-zinc-900 mb-4 rounded"></div>
                     <div className="h-4 w-full bg-zinc-900 mb-2 rounded"></div>
                     <div className="h-4 w-2/3 bg-zinc-900 rounded"></div>
                </div>
              </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-4">
        <div>
           <h2 className="text-3xl font-light text-white tracking-tight mb-2">บทความล่าสุด</h2>
           <p className="text-zinc-500 font-light text-sm">อัพเดทข่าวสารล่าสุดกับรีวิวอนิเมะ เกมเพลย์วิชวลโนเวล และสรุปเนื้อหาไลท์โนเวล</p>
        </div>
        <Link 
          href="/blog" 
          className="text-zinc-400 hover:text-white text-sm uppercase tracking-widest border-b border-zinc-800 hover:border-white transition-all pb-1 mb-1"
        >
          อ่านทั้งหมด
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
            authorAvatar={post.authorAvatar}
            image={post.image}
            slug={post.slug}
          />
        ))}
      </div>
    </div>
  );
}
