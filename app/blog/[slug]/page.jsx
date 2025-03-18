import React from "react";
import BlogDetailClient from "./BlogDetailClient"; 
import '../../styles/blogContent.css'; 
import { getPostDetails } from "@/lib/blogService";

export default async function BlogDetailPage({ params }) {
  const { slug } = params;
  const data = await getPostDetails(slug);
  
  return <BlogDetailClient data={data} slug={slug} />;
}

export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = await getPostDetails(slug);
  
  if (!data || !data.post) {
    return {
      title: 'บทความไม่พบ',
      description: 'ไม่พบบทความที่คุณต้องการ',
    };
  }
  
  return {
    title: `${data.post.title} - Hoshizora Blog`,
    description: data.post.description,
    openGraph: {
      title: data.post.title,
      description: data.post.description,
      images: [data.post.image],
    },
  };
}