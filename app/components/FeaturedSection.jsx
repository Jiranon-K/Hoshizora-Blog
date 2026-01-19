"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/helpers";

const FeaturedCard = ({ post, isLarge = false }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block relative overflow-hidden bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-500 ${
        isLarge ? "h-[500px]" : "h-60"
      }`}
    >
      {/* Image Container with darkening overlay */}
      <div className="absolute inset-0 overflow-hidden">
         <img
          src={getImageUrl(post.featured_image)}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-col justify-end h-full">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-xs font-medium tracking-widest uppercase text-white border border-zinc-700 px-3 py-1 bg-black/50 backdrop-blur-sm">
            {post.category_name}
          </span>
          <span className="text-zinc-400 text-xs font-light tracking-wide">
            {new Date(post.published_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <h3
          className={`${
            isLarge ? "text-4xl leading-tight" : "text-xl leading-snug"
          } font-light tracking-tight text-white mb-3 group-hover:text-zinc-200 transition-colors`}
        >
          {post.title}
        </h3>

        {isLarge && (
           <p className="text-zinc-400 text-sm font-light mb-6 line-clamp-2 max-w-2xl">
            {post.description}
          </p>
        )}

        <div className="flex items-center mt-auto pt-4 border-t border-white/10 w-full">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-zinc-700 mr-2">
            <img
              src={getImageUrl(
                post.authorAvatar || "/avatar/default.webp"
              )}
              alt={post.author}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-light text-zinc-300 uppercase tracking-wider">{post.author}</span>
          
           <span className="ml-auto text-xs font-light text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
            อ่านต่อ
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function FeaturedSection() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPosts() {
      try {
        const settingsRes = await fetch("/api/homepage-settings");
        const settings = await settingsRes.json();
        
        const response = await fetch("/api/posts");
        const data = await response.json();
        const publishedPosts = data.filter((post) => post.status === "published");

        let featured = [];
        
        if (settings.featured?.postIds && settings.featured.postIds.length > 0) {
          const orderedPosts = settings.featured.postIds
            .map(id => publishedPosts.find(p => p.id === id))
            .filter(Boolean);
          
          const usedIds = new Set(orderedPosts.map(p => p.id));
          const remainingPosts = publishedPosts
            .filter(p => !usedIds.has(p.id))
            .sort((a, b) => b.views - a.views);
          
          featured = [...orderedPosts, ...remainingPosts].slice(0, 3);
        } else {
          featured = publishedPosts
            .sort((a, b) => b.views - a.views)
            .slice(0, 3);
        }

        setFeaturedPosts(featured);
      } catch (error) {
        console.error("Error fetching featured posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedPosts();
  }, []);

  if (loading || featuredPosts.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {/* Large featured skeleton */}
        <div className="h-[500px] bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-end">
          <div className="h-6 w-24 bg-zinc-900 mb-4 rounded"></div>
          <div className="h-10 w-3/4 bg-zinc-900 mb-2 rounded"></div>
           <div className="h-10 w-1/2 bg-zinc-900 mb-6 rounded"></div>
           <div className="h-4 w-full bg-zinc-900 mb-2 rounded"></div>
           <div className="h-4 w-2/3 bg-zinc-900 mb-6 rounded"></div>
           <div className="flex justify-between items-center border-t border-zinc-900 pt-4">
               <div className="h-6 w-32 bg-zinc-900 rounded"></div>
           </div>
        </div>

        {/* Small featured skeletons */}
        <div className="grid grid-cols-1 gap-6">
          {[...Array(2)].map((_, index) => (
             <div key={index} className="h-60 bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-end">
               <div className="h-4 w-20 bg-zinc-900 mb-3 rounded"></div>
               <div className="h-6 w-3/4 bg-zinc-900 mb-2 rounded"></div>
                <div className="flex justify-between items-center border-t border-zinc-900 pt-4 mt-2">
                   <div className="h-4 w-24 bg-zinc-900 rounded"></div>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {featuredPosts.length > 0 && (
        <FeaturedCard post={featuredPosts[0]} isLarge={true} />
      )}

      <div className="grid grid-cols-1 gap-6 content-between">
        {featuredPosts.slice(1, 3).map((post) => (
          <FeaturedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
