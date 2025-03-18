import React from "react";
import Link from "next/link";
import { executeQuery } from "@/lib/db";
import { getImageUrl } from "@/lib/helpers";

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
    console.error('ข้อผิดพลาดในการดึงโพสต์เด่น:', error);
    return null;
  }
}

export default async function AnimeHero() {
  const featuredPost = await getFeaturedPost();
  
  if (!featuredPost) {
    return null;
  }

  return (
    <div className="relative w-full h-[45vh] min-h-[600px] overflow-hidden bg-[#0F1015]">
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
           style={{
             backgroundImage: 'radial-gradient(#FFFFFF 8%, transparent 8%)',
             backgroundSize: '30px 30px'
           }}></div>

      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transform transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: `url(${getImageUrl(featuredPost.featured_image || "/Hero.jpg")})`,
          filter: 'grayscale(50%) contrast(120%)'
        }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(transparent 0, transparent 24px, rgba(255,255,255,0.1) 24px, rgba(255,255,255,0.1) 25px)',
          opacity: 0.3
        }}></div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center px-8 lg:px-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-white transform transition-transform duration-500 hover:translate-x-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-1.5 bg-[#FF4B4B] rounded-full animate-pulse"></div>
              <span className="text-xs uppercase tracking-widest text-[#FF4B4B] font-bold">
                เรื่องเด่น
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight 
                           text-transparent bg-clip-text 
                           bg-gradient-to-r from-white to-gray-300
                           drop-shadow-[0_4px_10px_rgba(255,75,75,0.4)]
                           leading-tight
                           transition-all duration-300
                           hover:scale-[1.02] hover:brightness-110">
              {featuredPost.title}
            </h1>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-black/80 rounded-xl -z-10 
                              opacity-40 group-hover:opacity-75
                              transition-all duration-300
                              group-hover:skew-x-2"></div>
              <p className="text-lg md:text-xl text-gray-200 
                            line-clamp-3 
                            border-l-4 border-[#FF4B4B] 
                            pl-4 py-2 
                            relative z-10
                            transition-all duration-300
                            group-hover:translate-x-2
                            group-hover:text-white">
                {featuredPost.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href={`/blog/${featuredPost.slug}`}>
                <button className="group relative overflow-hidden 
                                   px-8 py-3 
                                   bg-[#FF4B4B] text-white 
                                   rounded-full 
                                   font-bold 
                                   uppercase tracking-wider
                                   transform transition-all duration-300 
                                   hover:scale-105 
                                   active:scale-95 
                                   shadow-lg
                                   border-2 border-transparent
                                   hover:border-white
                                   hover:shadow-[0_0_15px_rgba(255,75,75,0.5)]">
                  <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 
                                   transform -skew-x-12 
                                   transition-all duration-300"></span>
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>อ่านเพิ่มเติม</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </span>
                </button>
              </Link>
              
              <div className="relative group">
                <div className="absolute -inset-2 bg-white/10 rounded-full blur-sm 
                                opacity-0 group-hover:opacity-100 
                                transition-all duration-300"></div>
                <div className="relative z-10 bg-white/20 px-4 py-2 rounded-full 
                                text-sm text-white
                                transition-all duration-300
                                group-hover:scale-110
                                group-hover:bg-white/30">
                  ล่าสุด
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative overflow-hidden group">
            <div className="absolute -top-20 -left-20 
                            w-64 h-64 
                            bg-[#FF4B4B]/20 
                            rounded-full 
                            blur-2xl 
                            animate-blob
                            opacity-0 group-hover:opacity-100
                            transition-all duration-500"></div>
            <div className="absolute -bottom-20 -right-20 
                            w-80 h-80 
                            bg-[#4B64FF]/20 
                            rounded-full 
                            blur-2xl 
                            animate-blob animation-delay-2000
                            opacity-0 group-hover:opacity-100
                            transition-all duration-500"></div>
            
            <div className="absolute inset-0 border-8 border-white/10 pointer-events-none"></div>
            <div className="absolute inset-0 border-4 border-[#FF4B4B]/50 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}