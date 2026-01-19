import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";
import { getImageUrl } from "@/lib/helpers";

const BlogPostCard = ({ title, description, category, date, author, authorAvatar, authorTitle, image, slug }) => {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full"> 
       <div className="bg-zinc-950 h-full border border-zinc-900 transition-all duration-300 hover:border-zinc-600 flex flex-col">
        {/* Image - 16:9 Aspect Ratio enforced if needed, or keeping h-48 */}
        <div className="relative h-48 overflow-hidden border-b border-zinc-900">
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
          />
          <div className="absolute top-3 left-3">
             <span className="bg-black/80 backdrop-blur-sm text-zinc-300 text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-800">
              {category}
            </span>
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-center text-xs text-zinc-500 mb-3 space-x-2 font-light">
             <span>
              {date}
            </span>
          </div>

          <h3 className="text-lg font-light text-white mb-2 line-clamp-2 group-hover:text-zinc-200 transition-colors">
            {title}
          </h3>

          <p className="text-sm text-zinc-500 font-light mb-4 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-zinc-800">
              <img
                src={getImageUrl(authorAvatar || "/avatar/default.webp")}
                alt={author || "Author"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-light text-zinc-300">{author || "Author"}</span>
                 {/* Optional: Author Title if needed, maybe hide for minimal look */}
            </div>
             <div className="ml-auto"> 
                 <span className="text-xs text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">อ่านต่อ</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

async function getLatestPosts() {
  try {
    await connectToDatabase();
    
    const posts = await Post.find({ status: 'published' })
      .populate('user', 'displayName title avatar')
      .populate('category', 'name slug')
      .select('id title description featuredImage publishedAt slug')
      .sort({ publishedAt: -1 })
      .limit(4)
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
      category: post.category?.name || null,
      author: post.user?.displayName || null,
      authorTitle: post.user?.title || null,
      authorAvatar: post.user?.avatar || null,
      slug: post.slug
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

async function BlogPostGrid() {
  const blogPosts = await getLatestPosts();

  // Skeleton for empty state
  if (blogPosts.length === 0) {
    return (
      <div className="w-full py-16 px-4 md:px-6 lg:px-8 border-t border-zinc-900">
        <div className="mx-auto max-w-screen-xl">
           <div className="flex flex-col items-center mb-12 text-center animate-pulse">
            <div className="h-8 w-48 bg-zinc-900 mb-4 rounded"></div>
            <div className="h-4 w-64 bg-zinc-900 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-zinc-950 border border-zinc-900 h-96 flex flex-col">
                <div className="h-48 bg-zinc-900 w-full mb-4"></div>
                <div className="p-5 flex-grow">
                     <div className="h-3 w-20 bg-zinc-900 mb-3 rounded"></div>
                     <div className="h-6 w-full bg-zinc-900 mb-2 rounded"></div>
                     <div className="h-4 w-full bg-zinc-900 mb-1 rounded"></div>
                      <div className="h-4 w-2/3 bg-zinc-900 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 px-4 md:px-6 lg:px-8 bg-black border-t border-zinc-900">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-3xl font-light text-white mb-3 tracking-tight">Latest Articles</h2>
           <div className="h-px w-16 bg-zinc-800"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map(post => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              description={post.description}
              category={post.category}
              date={post.date}

              author={post.author}
              authorAvatar={post.authorAvatar}
              authorTitle={post.authorTitle}
              image={post.image}
              slug={post.slug}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <Link href="/blog">
            <button className="text-zinc-400 hover:text-white text-sm uppercase tracking-widest border-b border-zinc-800 hover:border-white transition-all pb-1">
              อ่านทั้งหมด
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPostGrid;
