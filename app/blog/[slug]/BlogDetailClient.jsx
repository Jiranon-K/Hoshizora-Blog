"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import DOMPurify from "isomorphic-dompurify";
import Breadcrumbs from '../components/Breadcrumbs';
import PostHeader from '../components/PostHeader';
import PostImage from '../components/PostImage';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import '../../styles/blogContent.css';


const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'a', 'img', 'blockquote', 'pre', 'code',
    'div', 'span', 'iframe', 'figure', 'figcaption'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'class', 'style', 'target', 'rel',
    'width', 'height', 'frameborder', 'allowfullscreen', 'allow',
    'data-youtube-video', 'title'
  ],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
  // Allow YouTube embeds
  ADD_TAGS: ['iframe'],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
};

const BlogDetailClient = ({ data, slug }) => {
  if (!data || !data.post) {
    return (
      <div className="w-full py-16 text-center">
        <div className="text-red-500">ไม่พบบทความนี้</div>
        <Link href="/blog">
          <button className="btn btn-primary mt-4">กลับไปหน้าบทความ</button>
        </Link>
      </div>
    );
  }

  const { post, relatedPosts } = data;

  
  const sanitizedContent = useMemo(() => {
    if (!post.content) return '';
    return DOMPurify.sanitize(post.content, DOMPURIFY_CONFIG);
  }, [post.content]);

  return (
    <div className="w-full py-8 px-4 md:py-12 md:px-6 text-white bg-black">
      <Head>
        <title>{post.title} - Hoshizora Blog</title>
        <meta name="description" content={post.description} />
      </Head>
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumbs */}
        <Breadcrumbs post={post} />
        
        {/* Header */}
        <PostHeader post={post} />
        
        {/* Featured Image */}
        <PostImage image={post.image} title={post.title} />
        
        {/* Content -*/}
        <div className="blog-content mb-8" 
             dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        
        
        {/* Author */}
        <AuthorBox 
          author={post.author}
          authorTitle={post.authorTitle}
          authorBio={post.authorBio}
          authorAvatar={post.authorAvatar}
        />
        
        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </div>

     
    </div>
  );
};

export default BlogDetailClient;