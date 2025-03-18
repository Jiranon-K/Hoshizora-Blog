import React from "react";
import Link from "next/link";
import { executeQuery } from "@/lib/db";
import { getImageUrl } from "@/lib/helpers";


const BlogPostCard = ({ title, description, category, date, author, authorTitle, image, slug }) => {
  return (
    <div className="group relative overflow-hidden bg-white rounded-lg transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border border-gray-100 h-full flex flex-col">
      
      <div className="relative h-52 overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
       
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        
        <div className="absolute top-3 left-3">
          <span className="bg-pink-400/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium tracking-wide shadow-sm">
            {category}
          </span>
        </div>
      </div>

      <div className="flex-grow p-5 flex flex-col">
       
        <div className="text-xs text-gray-500 mb-2 font-mono tracking-wide">
          {date}
        </div>
        
       
        <h2 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
          {title}
        </h2>
        
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        
        <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100 p-0.5">
            <img 
              src={typeof author === 'object' ? 
                getImageUrl(author.avatar || "/avatar/Aharen-san.webp") : 
                getImageUrl("/avatar/Aharen-san.webp")} 
              alt={typeof author === 'object' ? author.display_name || "Author" : author} 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{typeof author === 'object' ? author.display_name || "Author" : author}</p>
            <p className="text-xs text-gray-500">{authorTitle}</p>
          </div>
          
          
          <div className="ml-auto">
            <Link href={`/blog/${slug}`}>
              <span className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                อ่านต่อ
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


const CategoryFilter = ({ categories, currentCategory }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        <Link href="?">
          <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
            ${!currentCategory ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'}`}>
            ทั้งหมด
          </span>
        </Link>
        
        {categories.map((category) => (
          <Link key={category.slug} href={`?category=${category.slug}`}>
            <span className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer
              ${currentCategory === category.slug ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'}`}>
              {category.name}
              <span className="ml-1 text-xs opacity-70">({category.postCount})</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

async function getCategories() {
  try {
    const categories = await executeQuery({
      query: `
        SELECT 
          c.name,
          c.slug,
          COUNT(p.id) as postCount
        FROM 
          categories c
        LEFT JOIN 
          posts p ON c.id = p.category_id AND p.status = 'published'
        GROUP BY 
          c.id
        ORDER BY 
          c.name ASC
      `
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getPosts(categorySlug = '', page = 1, perPage = 12) {
  try {
    let query = `
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
    `;

    const offset = (page - 1) * perPage;
    const values = [];

    if (categorySlug) {
      query += ` AND c.slug = ?`;
      values.push(categorySlug);
    }

    const countQuery = `
      SELECT COUNT(*) as total FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'published' ${categorySlug ? 'AND c.slug = ?' : ''}
    `;
    
    const [totalResult] = await executeQuery({
      query: countQuery,
      values: categorySlug ? [categorySlug] : []
    });

    query += ` ORDER BY p.published_at DESC LIMIT ? OFFSET ?`;
    values.push(perPage, offset);

    const posts = await executeQuery({ query, values });

    return {
      posts: posts.map(post => ({
        ...post,
        date: new Date(post.date).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })),
      pagination: {
        total: totalResult.total,
        page,
        perPage,
        totalPages: Math.ceil(totalResult.total / perPage)
      }
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }
}

async function AllBlogPostGrid({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const category = searchParams.category || '';
  const perPage = 12;

  const categories = await getCategories();
  const { posts, pagination } = await getPosts(category, page, perPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/30 relative">
     
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-0 top-0 h-32 w-32">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M10,50 Q50,10 90,50 Q50,90 10,50 Z" />
          </svg>
        </div>
        <div className="absolute right-0 bottom-0 h-40 w-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="40" />
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>
      </div>
      
      <div className="w-full py-16 px-4 md:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-screen-xl">
          
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="inline-block mb-2">
              <span className="inline-block w-3 h-3 bg-pink-400 rounded-full mr-1"></span>
              <span className="inline-block w-3 h-3 bg-indigo-400 rounded-full mr-1"></span>
              <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-gray-800 relative">
              <span className="relative z-10">บทความทั้งหมดของเรา</span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-indigo-200/50 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-gray-600 max-w-lg mb-6">เรื่องราวและบทความที่น่าสนใจ อัพเดทล่าสุดจากนักเขียนของเรา</p>
            
           
            <div className="w-16 h-1 bg-indigo-400 rounded-full"></div>
          </div>
          
       
          <CategoryFilter categories={categories} currentCategory={category} />
          
         
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {posts.map(post => (
                <BlogPostCard
                  key={post.id}
                  {...post}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xl font-medium text-gray-500">ไม่พบบทความในหมวดหมู่นี้</p>
              <p className="text-sm text-gray-400 mt-1">ลองเลือกหมวดหมู่อื่น หรือกลับไปที่หมวดหมู่ทั้งหมด</p>
            </div>
          )}
          
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                
                {page > 1 && (
                  <Link 
                    href={category ? 
                      `?category=${category}&page=${page - 1}` : 
                      `?page=${page - 1}`}
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                )}
                
                
                {Array.from({ length: pagination.totalPages }, (_, index) => {
                  const pageNum = index + 1;
                  
                  if (
                    pageNum === 1 || 
                    pageNum === pagination.totalPages || 
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    const href = category ? 
                      `?category=${category}&page=${pageNum}` : 
                      `?page=${pageNum}`;
                    
                    return (
                      <Link 
                        key={pageNum}
                        href={href}
                      >
                        <span className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all
                          ${page === pageNum 
                            ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-md' 
                            : 'border-2 border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                          {pageNum}
                        </span>
                      </Link>
                    );
                  }
                  
                 
                  if (
                    (pageNum === page - 2 && page > 3) || 
                    (pageNum === page + 2 && page < pagination.totalPages - 2)
                  ) {
                    return (
                      <span key={pageNum} className="text-gray-400 px-1">...</span>
                    );
                  }
                  
                  return null;
                })}
                
                
                {page < pagination.totalPages && (
                  <Link 
                    href={category ? 
                      `?category=${category}&page=${page + 1}` : 
                      `?page=${page + 1}`}
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllBlogPostGrid;