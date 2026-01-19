"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/helpers";

const CategoryCard = ({ title, description, slug, image, postCount }) => {
  return (
    <Link href={`/blog?category=${slug}`} className="group">
      <div className="relative h-64 rounded-xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10"></div>
        <img
          src={getImageUrl(image)}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-white/80 text-sm mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs bg-primary/80 text-pink-500 rounded-full px-3 py-1">
              {postCount} โพสต์
            </span>
            <span className="text-white text-sm group-hover:underline transition-all">
              อ่านเพิ่มเติม →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryImages = {
    anime: "/uploads/t1.jpg",
    "visual-novel": "/uploads/t3.webp",
    novels: "/uploads/t5.webp",
    default: "/placeholder-image.jpg",
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        const enhancedCategories = data.map((cat) => ({
          ...cat,
          image: categoryImages[cat.slug] || categoryImages.default,
          description: getCategoryDescription(cat.slug),
        }));

        setCategories(enhancedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  function getCategoryDescription(slug) {
    switch (slug) {
      case "anime":
        return "รวมรีวิว อัพเดท และพูดคุยเกี่ยวกับอนิเมะใหม่ๆ";
      case "visual-novel":
        return "เจาะลึกเรื่องราวและรีวิวเกมวิชวลโนเวล";
      case "novels":
        return "ค้นพบนิยายและไลท์โนเวลที่น่าสนใจ พร้อมการดัดแปลงสู่สื่ออื่นๆ";
      default:
        return "สำรวจคอนเทนต์ที่น่าสนใจของเรา";
    }
  }

  if (loading || categories.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-md bg-base-100">
            {/* Image skeleton */}
            <div className="skeleton w-full h-full"></div>
            
            {/* Content overlay skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-base-300/90 to-transparent">
              {/* Title skeleton */}
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              
              {/* Description skeleton */}
              <div className="skeleton h-4 w-full mb-1"></div>
              <div className="skeleton h-4 w-2/3 mb-3"></div>
              
              {/* Footer skeleton */}
              <div className="flex items-center justify-between">
                <div className="skeleton h-5 w-16 rounded-full"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.name}
          description={category.description}
          slug={category.slug}
          image={category.image}
          postCount={category.post_count || 0}
        />
      ))}
    </div>
  );
};

export default CategoryShowcase;
