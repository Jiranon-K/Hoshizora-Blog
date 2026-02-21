"use client";

import React from "react";
import Link from "next/link";

import Breadcrumbs from "../components/Breadcrumbs";
import PostHeader from "../components/PostHeader";
import PostImage from "../components/PostImage";
import AuthorBox from "../components/AuthorBox";
import RelatedPosts from "../components/RelatedPosts";
import "../../styles/blogContent.css";
import FadeIn from "../../components/motion/FadeIn";

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

  const sanitizedContent = post.content || "";

  return (
    <div className="w-full py-8 px-4 md:py-12 md:px-6 text-white bg-black">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumbs */}
        <FadeIn delay={0}>
          <Breadcrumbs post={post} />
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <PostHeader post={post} />
        </FadeIn>

        {/* Featured Image */}
        <FadeIn delay={0.2} direction="none">
          <PostImage image={post.image} title={post.title} />
        </FadeIn>

        {/* Content */}
        <FadeIn delay={0.3}>
          <div
            className="blog-content mb-8"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </FadeIn>

        {/* Author */}
        <FadeIn delay={0.1}>
          <AuthorBox
            author={post.author}
            authorTitle={post.authorTitle}
            authorBio={post.authorBio}
            authorAvatar={post.authorAvatar}
          />
        </FadeIn>

        {/* Related Posts */}
        <FadeIn delay={0.15}>
          <RelatedPosts posts={relatedPosts} />
        </FadeIn>
      </div>
    </div>
  );
};

export default BlogDetailClient;
