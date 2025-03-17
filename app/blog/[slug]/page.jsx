import React from "react";
import { executeQuery } from "@/lib/db"; 
import BlogDetailClient from "./BlogDetailClient"; 
import '../../styles/blogContent.css';

async function getPostDetails(slug) {
  try {
    
    await executeQuery({
      query: 'UPDATE posts SET views = views + 1 WHERE slug = ?',
      values: [slug]
    });
    
    
    const [post] = await executeQuery({
      query: `
        SELECT 
          p.id, 
          p.title, 
          p.description, 
          p.content,
          p.featured_image as image, 
          p.published_at as date,
          p.views,
          c.name as category,
          c.slug as categorySlug,
          u.display_name as author,
          u.title as authorTitle,
          u.avatar as authorAvatar,
          u.bio as authorBio,
          p.slug
        FROM 
          posts p
        JOIN 
          users u ON p.user_id = u.id
        LEFT JOIN 
          categories c ON p.category_id = c.id
        WHERE 
          p.slug = ? AND p.status = 'published'
        LIMIT 1
      `,
      values: [slug]
    });

    if (!post) {
      return null;
    }

    
    const date = new Date(post.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    post.date = date.toLocaleDateString('th-TH', options);

    
    const relatedPosts = await executeQuery({
      query: `
        SELECT 
          p.id, 
          p.title, 
          p.featured_image as image,
          p.slug
        FROM 
          posts p
        WHERE 
          p.category_id = (SELECT category_id FROM posts WHERE slug = ?)
          AND p.slug != ?
          AND p.status = 'published'
        ORDER BY 
          p.published_at DESC
        LIMIT 3
      `,
      values: [slug, slug]
    });

  
    const tags = await executeQuery({
      query: `
        SELECT 
          t.name,
          t.slug
        FROM 
          tags t
        JOIN 
          post_tags pt ON t.id = pt.tag_id
        WHERE 
          pt.post_id = ?
      `,
      values: [post.id]
    });

    
    if (post.content) {
      
      post.content = post.content.replace(
        /<iframe(.*?)src="https:\/\/www\.youtube\.com\/embed\/(.*?)"(.*?)><\/iframe>/g,
        '<div data-youtube-video><iframe src="https://www.youtube.com/embed/$2" frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>'
      );
    }

    return {
      post: {
        ...post,
        tags
      },
      relatedPosts
    };
  } catch (error) {
    console.error('Error fetching post details:', error);
    return null;
  }
}


export default async function BlogDetailPage({ params }) {
  
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const data = await getPostDetails(slug);

 
  const metadata = {
    title: data?.post?.title || 'บทความไม่พบ',
    description: data?.post?.description || 'ไม่พบบทความที่คุณต้องการ',
    openGraph: {
      title: data?.post?.title,
      description: data?.post?.description,
      images: [data?.post?.image],
    },
  };
  
  return (
    <>
      <BlogDetailClient data={data} slug={slug} />
    </>
  );
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