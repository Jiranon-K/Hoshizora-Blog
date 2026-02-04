import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/helpers";

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-zinc-800">
      {/* Section Header */}
      <h2 className="text-lg font-light tracking-wide uppercase text-zinc-500 mb-8">
        บทความที่เกี่ยวข้อง
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((related) => (
          <Link
            href={`/blog/${related.slug}`}
            key={related.id}
            className="group block"
          >
            {/* Minimal Card */}
            <article className="bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all duration-300 overflow-hidden h-full flex flex-col">
              {/* Image Container */}
              <div className="h-44 overflow-hidden relative">
                <Image
                  src={getImageUrl(related.image)}
                  alt={related.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-base font-light text-white line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {related.title}
                </h3>

                {/* Minimal Read More Indicator */}
                <div className="mt-auto pt-4">
                  <span className="text-xs font-medium tracking-widest uppercase text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    อ่านต่อ →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
