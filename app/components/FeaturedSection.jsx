"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/helpers";

const FeaturedCard = ({ post, isLarge = false }) => {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group block relative overflow-hidden rounded-xl ${
        isLarge ? "h-134" : "h-64"
      } shadow-md hover:shadow-xl transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10"></div>
      <img
        src={getImageUrl(post.featured_image)}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center mb-3">
          <span className="bg-primary/90 backdrop-blur-sm text-pink-600 text-xs px-3 py-1 rounded-full shadow-sm mr-3">
            {post.category_name}
          </span>
          <span className="text-white/80 text-xs">
            {new Date(post.published_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <h3
          className={`${
            isLarge ? "text-2xl" : "text-xl"
          } font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400  transition-colors`}
        >
          {post.title}
        </h3>

        <p className="text-white/80 text-sm mb-3 line-clamp-2">
          {post.description}
        </p>

        <div className="flex items-center">
          <div className="avatar mr-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/30">
              <img
                src={getImageUrl(
                  post.authorAvatar || "/avatar/Aharen-san.webp"
                )}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{post.author}</p>
          </div>

          <span className="text-white text-sm group-hover:underline transition-all">
            อ่านเพิ่มเติม →
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
        const response = await fetch("/api/posts");
        const data = await response.json();

        const featured = data
          .filter((post) => post.status === "published")
          .sort((a, b) => b.views - a.views)
          .slice(0, 3);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Large featured skeleton */}
        <div className="relative h-134 rounded-xl overflow-hidden shadow-md bg-base-100">
          <div className="skeleton w-full h-full"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-base-300/90 to-transparent">
            <div className="flex items-center mb-3">
              <div className="skeleton h-5 w-20 rounded-full mr-3"></div>
              <div className="skeleton h-4 w-24"></div>
            </div>
            <div className="skeleton h-8 w-3/4 mb-2"></div>
            <div className="skeleton h-8 w-1/2 mb-3"></div>
            <div className="skeleton h-4 w-full mb-1"></div>
            <div className="skeleton h-4 w-2/3 mb-3"></div>
            <div className="flex items-center">
              <div className="skeleton w-8 h-8 rounded-full shrink-0 mr-3"></div>
              <div className="skeleton h-4 w-24"></div>
              <div className="skeleton h-4 w-28 ml-auto"></div>
            </div>
          </div>
        </div>

        {/* Small featured skeletons */}
        <div className="grid grid-cols-1 gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-md bg-base-100">
              <div className="skeleton w-full h-full"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-base-300/90 to-transparent">
                <div className="flex items-center mb-3">
                  <div className="skeleton h-5 w-16 rounded-full mr-3"></div>
                  <div className="skeleton h-4 w-20"></div>
                </div>
                <div className="skeleton h-6 w-3/4 mb-2"></div>
                <div className="skeleton h-4 w-full mb-1"></div>
                <div className="skeleton h-4 w-1/2 mb-3"></div>
                <div className="flex items-center">
                  <div className="skeleton w-8 h-8 rounded-full shrink-0 mr-3"></div>
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-24 ml-auto"></div>
                </div>
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

      <div className="grid grid-cols-1 gap-6">
        {featuredPosts.slice(1, 3).map((post) => (
          <FeaturedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
