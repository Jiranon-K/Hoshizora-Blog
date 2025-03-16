import React from "react";
import Link from "next/link";
import { executeQuery } from "@/lib/db";


const getImageUrlWithTimestamp = (imageUrl) => {
  if (!imageUrl) return "/placeholder-image.jpg";
  
  
  if (imageUrl.startsWith('http')) {
    
    return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }
  
  
  return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
};

const BlogPostCard = ({ title, description, category, date, author, authorTitle, image, slug }) => {
  return (
    <div className="card bg-base-100 h-full overflow-hidden border border-gray-100 rounded-lg transition-all duration-300 hover:shadow-md">
      {/* Image Container with Aspect Ratio */}
      <figure className="relative h-48 overflow-hidden">
        <img
          src={getImageUrlWithTimestamp(image)}  
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Category Tag */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
            {category}
          </span>
        </div>
      </figure>

      <div className="card-body p-4">
        {/* Meta Info */}
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span>{date}</span>
        </div>
        
        {/* Title */}
        <h2 className="card-title text-lg font-medium mb-2 line-clamp-2">
          {title}
        </h2>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        {/* Author */}
        <div className="flex items-center mt-auto pt-2 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
            <img 
              src={typeof author === 'object' ? 
                 getImageUrlWithTimestamp(author.avatar || "/avatar/Aharen-san.webp") : 
                 getImageUrlWithTimestamp("/avatar/Aharen-san.webp")}  
              alt={typeof author === 'object' ? author.display_name || "Author" : author} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium">{typeof author === 'object' ? author.display_name || "Author" : author}</p>
            <p className="text-xs text-gray-500">{authorTitle}</p>
          </div>
          
          {/* Read More Link */}
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
    const rows = await executeQuery({
      query: `
        SELECT 
          p.id, 
          p.title, 
          p.description, 
          p.featured_image as image, 
          p.published_at as date,
          c.name as category,
          u.display_name as author,
          u.title as authorTitle,
          u.avatar as authorAvatar,
          p.slug
        FROM 
          posts p
        JOIN 
          users u ON p.user_id = u.id
        LEFT JOIN 
          categories c ON p.category_id = c.id
        WHERE 
          p.status = 'published'
        ORDER BY 
          p.published_at DESC
        LIMIT 4
      `
    });

    return rows.map(post => ({
      ...post,
      date: new Date(post.date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error('Failed to fetch blog posts');
  }
}


async function BlogPostGrid() {
  const blogPosts = await getLatestPosts();

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