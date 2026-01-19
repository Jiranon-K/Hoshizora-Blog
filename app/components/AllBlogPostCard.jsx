import React from "react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";
import Category from "@/lib/models/Category";
import { getImageUrl } from "@/lib/helpers";

const BlogPostCard = ({ title, description, category, date, author, authorTitle, image, slug }) => {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full"> 
       <div className="bg-zinc-950 h-full border border-zinc-900 transition-all duration-300 hover:border-zinc-700 flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden border-b border-zinc-900">
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

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center text-xs text-zinc-500 mb-3 space-x-2 font-light">
             <span>{date}</span>
          </div>

          <h3 className="text-xl font-light text-white mb-3 line-clamp-2 group-hover:text-zinc-200 transition-colors tracking-tight">
            {title}
          </h3>

          <p className="text-sm text-zinc-500 font-light mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>

          <div className="mt-auto pt-4 border-t border-zinc-900 flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 border border-zinc-800 grayscale opacity-70">
              <img 
                src={typeof author === 'object' ? 
                  getImageUrl(author.avatar || "/avatar/default.webp") : 
                  getImageUrl("/avatar/default.webp")} 
                alt={typeof author === 'object' ? author.display_name || "Author" : author} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-light text-zinc-300">{typeof author === 'object' ? author.display_name || "Author" : author}</span>
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

const CategoryFilter = ({ categories, currentCategory }) => {
  return (
    <div className="mb-12 border-b border-zinc-800 pb-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="?">
          <span className={`text-sm tracking-wide transition-colors duration-300 cursor-pointer pb-4 border-b-2 
            ${!currentCategory 
              ? 'text-white border-white font-medium' 
              : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
            ทั้งหมด
          </span>
        </Link>
        
        {categories.map((category) => (
          <Link key={category.slug} href={`?category=${category.slug}`}>
            <span className={`text-sm tracking-wide transition-colors duration-300 cursor-pointer pb-4 border-b-2
              ${currentCategory === category.slug 
                ? 'text-white border-white font-medium' 
                : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

async function getCategories() {
  try {
    await connectToDatabase();
    
    const categories = await Category.find().lean();
    
    // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({ 
          category: category._id, 
          status: 'published' 
        });
        return {
          name: category.name,
          slug: category.slug,
          postCount
        };
      })
    );
    
    return categoriesWithCounts.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getPosts(categorySlug = '', page = 1, perPage = 12) {
  try {
    await connectToDatabase();
    
    const offset = (page - 1) * perPage;
    
    // Build filter
    let filter = { status: 'published' };
    
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug }).lean();
      if (category) {
        filter.category = category._id;
      }
    }
    
    // Get total count
    const total = await Post.countDocuments(filter);
    
    // Get posts with populated data
    const posts = await Post.find(filter)
      .populate('user', 'displayName title avatar')
      .populate('category', 'name slug')
      .select('id title description featuredImage publishedAt slug')
      .sort({ publishedAt: -1 })
      .skip(offset)
      .limit(perPage)
      .lean();

    return {
      posts: posts.map(post => ({
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
      })),
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage)
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
    <div className="min-h-screen bg-black text-white">
      <div className="w-full py-16 px-4 md:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-screen-xl">
          
          <div className="flex flex-col items-start mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tighter text-white">
              บทความทั้งหมด
            </h2>
            <p className="text-zinc-500 font-light max-w-lg text-lg">
              อัพเดทข่าวสารล่าสุดกับรีวิวอนิเมะ 
            </p>
          </div>
          
          <CategoryFilter categories={categories} currentCategory={category} />
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {posts.map(post => (
                <BlogPostCard
                  key={post.id}
                  {...post}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-zinc-900 border-dashed rounded-lg bg-zinc-950/50">
              <p className="text-xl font-light text-zinc-500">No posts found in this category.</p>
              <Link href="?" className="text-sm text-zinc-600 mt-2 hover:text-white underline transition-colors">Return to all posts</Link>
            </div>
          )}
          
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-20 border-t border-zinc-900 pt-8">
              <div className="flex items-center gap-4">
                {page > 1 && (
                  <Link 
                    href={category ? 
                      `?category=${category}&page=${page - 1}` : 
                      `?page=${page - 1}`}
                  >
                    <span className="px-4 py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-all">
                      Previous
                    </span>
                  </Link>
                )}
                
                <span className="text-zinc-500 text-sm font-mono">
                  Page {page} of {pagination.totalPages}
                </span>

                {page < pagination.totalPages && (
                  <Link 
                    href={category ? 
                      `?category=${category}&page=${page + 1}` : 
                      `?page=${page + 1}`}
                  >
                    <span className="px-4 py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white text-sm transition-all">
                      Next
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
