import React from "react";
import BlogDetailClient from "./BlogDetailClient";
import "../../styles/blogContent.css";
import { getPostDetails, getAllPostSlugs } from "@/lib/blogService";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// Static Generation: Pre-render all blog posts at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

export default async function BlogDetailPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await getPostDetails(slug);

  // JSON-LD Structured Data for SEO
  const jsonLd = data?.post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: data.post.title,
        description: data.post.description,
        image: data.post.image,
        datePublished: data.post.date,
        author: {
          "@type": "Person",
          name: data.post.author,
        },
        publisher: {
          "@type": "Organization",
          name: "Hoshizora Blog",
        },
      }
    : null;

  return (
    <>
      {/* JSON-LD Script for Search Engines */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogDetailClient data={data} slug={slug} />
    </>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const data = await getPostDetails(slug);

  if (!data || !data.post) {
    return {
      title: "บทความไม่พบ",
      description: "ไม่พบบทความที่คุณต้องการ",
    };
  }

  return {
    title: `${data.post.title} - Hoshizora Blog`,
    description: data.post.description,
    openGraph: {
      title: data.post.title,
      description: data.post.description,
      images: [data.post.image],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: data.post.title,
      description: data.post.description,
      images: [data.post.image],
    },
  };
}
