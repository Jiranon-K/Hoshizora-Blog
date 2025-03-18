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
          <span className="bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-sm mr-3">
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
          } font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-content transition-colors`}
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading loading-dots loading-lg text-primary"></div>
      </div>
    );
  }

  if (featuredPosts.length === 0) {
    return null;
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
