import React from "react";
import Link from "next/link";
import { executeQuery } from "@/lib/db";


const getImageUrlWithTimestamp = (imageUrl) => {
  if (!imageUrl) return "/Hero.jpg";
  
  
  if (imageUrl.startsWith('http')) {
    
    return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }
  
  
  return `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
};

async function getFeaturedPost() {
  try {
    const [featuredPost] = await executeQuery({
      query: `
        SELECT 
          id, 
          title, 
          description, 
          slug, 
          featured_image
        FROM 
          posts
        WHERE 
          status = 'published'
        ORDER BY 
          published_at DESC
        LIMIT 1
      `,
      values: []
    });

    return featuredPost;
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }
}

const Hero = async () => {
  const featuredPost = await getFeaturedPost();
  
  if (!featuredPost) {
    return null;
  }

  return (
    <div className="w-full py-4 md:py-6 lg:py-8">
      <div className="w-full">
        <div className="flex justify-center items-center">
          <div className="relative w-full md:w-5/6 lg:w-3/4 xl:w-2/3">
            {/* Hero Image */}
            <img
              src={getImageUrlWithTimestamp(featuredPost.featured_image || "/Hero.jpg")}
              alt={featuredPost.title}
              className="w-full h-auto md:h-64 lg:h-124 object-cover rounded-lg md:rounded-xl shadow-md"
            />

            {/* Card */}
            <div className="absolute left-2 sm:left-4 bottom-2 sm:bottom-4 
                            w-4/5 sm:w-3/4 md:w-3/5 
                            bg-base-100 shadow-lg rounded-lg md:rounded-xl 
                            p-2 sm:p-3 md:p-4">
              <h2 className="text-base sm:text-lg md:text-xl font-bold line-clamp-1">
                {featuredPost.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 md:line-clamp-3 mt-1">
                {featuredPost.description}
              </p>
              <div className="mt-2 text-right">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <button className="btn btn-primary btn-xs sm:btn-sm">
                    อ่าน
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;