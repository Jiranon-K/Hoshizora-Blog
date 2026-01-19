"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/helpers";

const CategoryCard = ({ title, description, slug, image, postCount }) => {
  return (
    <Link href={`/blog?category=${slug}`} className="group block h-full">
      <div className="relative h-64 overflow-hidden border border-zinc-900 bg-zinc-950 transition-colors duration-300 hover:border-zinc-700">
        {/* Background Image with heavy overlay */}
        <div className="absolute inset-0">
          <img
            src={getImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-40"
          />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-light text-white mb-2 tracking-tight group-hover:text-zinc-200 transition-colors">
                {title}
              </h3>
              <p className="text-zinc-400 text-sm font-light line-clamp-2 max-w-xs group-hover:text-zinc-300 transition-colors">
                {description}
              </p>
            </div>
            
             <span className="text-xs font-medium tracking-widest uppercase text-zinc-500 border border-zinc-800 px-2 py-1 bg-black">
              {postCount} Posts
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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();

        const enhancedCategories = data.map((cat) => ({
          ...cat,
          image: cat.showcaseImage || "/placeholder-image.jpg",
          description: cat.showcaseDescription || getDefaultCategoryDescription(cat.slug),
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

  function getDefaultCategoryDescription(slug) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-64 bg-zinc-950 border border-zinc-900 p-6 flex flex-col justify-end">
            <div className="h-8 w-1/2 bg-zinc-900 mb-2 rounded"></div>
            <div className="h-4 w-full bg-zinc-900 mb-1 rounded"></div>
            <div className="h-4 w-2/3 bg-zinc-900 rounded"></div>
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
