"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import Breadcrumbs from '../components/Breadcrumbs';
import PostHeader from '../components/PostHeader';
import PostImage from '../components/PostImage';
import AuthorBox from '../components/AuthorBox';
import RelatedPosts from '../components/RelatedPosts';
import '../../styles/blogContent.css';

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

  return (
    <div className="w-full py-8 px-4 md:py-12 md:px-6">
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
        
        {/* Content */}
        <div className="blog-content mb-8" 
             dangerouslySetInnerHTML={{ __html: post.content }} />
        
        
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