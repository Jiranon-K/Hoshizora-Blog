import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";
import { getImageUrl } from "@/lib/helpers";

const BlogPostCard = ({ title, description, category, date, author, authorTitle, image, slug }) => {
  return (
    <div className="card bg-base-100 h-full overflow-hidden border border-gray-100 rounded-lg transition-all duration-300 hover:shadow-md">
     
      <figure className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(image)} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {category}
          </span>
        </div>
      </figure>

      <div className="card-body p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>{date}</span>
        </div>
        
        <h2 className="card-title text-lg font-medium mb-2 line-clamp-2">
          {title}
        </h2>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <img 
              src={typeof author === 'object' ? 
                 getImageUrl(author.avatar || "/avatar/Aharen-san.webp") : 
                 getImageUrl("/avatar/Aharen-san.webp")}  
              alt={typeof author === 'object' ? author.display_name || "Author" : author} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{typeof author === 'object' ? author.display_name || "Author" : author}</p>
            <p className="text-xs text-gray-500">{authorTitle}</p>
          </div>
          
          <div className="ml-auto">
            <Link href={`/blog/${slug}`}>
              <button className="btn btn-sm btn-ghost text-primary">
                อ่านต่อ
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
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
      <div className="w-full py-8 px-4 md:py-12 md:px-6 lg:py-16 lg:px-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="skeleton h-10 w-48 mb-4"></div>
            <div className="skeleton h-5 w-80"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card bg-base-100 h-full overflow-hidden border border-gray-100 rounded-lg">
                {/* Image skeleton */}
                <figure className="relative h-48 overflow-hidden">
                  <div className="skeleton w-full h-full"></div>
                  <div className="absolute top-3 left-3">
                    <div className="skeleton h-5 w-16 rounded-md"></div>
                  </div>
                </figure>

                <div className="card-body p-4">
                  {/* Date skeleton */}
                  <div className="skeleton h-3 w-24 mb-2"></div>
                  
                  {/* Title skeleton */}
                  <div className="skeleton h-6 w-full mb-1"></div>
                  <div className="skeleton h-6 w-3/4 mb-2"></div>
                  
                  {/* Description skeleton */}
                  <div className="skeleton h-4 w-full mb-1"></div>
                  <div className="skeleton h-4 w-full mb-1"></div>
                  <div className="skeleton h-4 w-2/3 mb-4"></div>
                  
                  {/* Author section skeleton */}
                  <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
                    <div className="skeleton w-8 h-8 rounded-full shrink-0 mr-3"></div>
                    <div>
                      <div className="skeleton h-4 w-20 mb-1"></div>
                      <div className="skeleton h-3 w-16"></div>
                    </div>
                    <div className="ml-auto">
                      <div className="skeleton h-8 w-16 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <div className="skeleton h-12 w-40 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 md:py-12 md:px-6 lg:py-16 lg:px-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">บทความล่าสุด</h2>
          <p className="text-gray-600 max-w-md">เรื่องราวและบทความที่น่าสนใจ อัพเดทล่าสุดจากนักเขียนของเรา</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {blogPosts.map(post => (
            <BlogPostCard
              key={post.id}
              title={post.title}
              description={post.description}
              category={post.category}
              date={post.date}
              author={post.author}
              authorTitle={post.authorTitle}
              image={post.image}
              slug={post.slug}
            />
          ))}
        </div>
        
        <div className="flex justify-center mt-10">
          <Link href="/blog">
            <button className="btn btn-outline btn-primary">ดูบทความทั้งหมด</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BlogPostGrid;