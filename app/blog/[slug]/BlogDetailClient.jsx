"use client";

import React from "react";
import Link from "next/link";
import Head from "next/head";
import { getImageUrl } from "@/lib/helpers";

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
        <div className="mb-6 text-sm">
          <Link href="/">หน้าแรก</Link> /{' '}
          <Link href="/blog">บทความ</Link> /{' '}
          <Link href={`/blog?category=${post.categorySlug}`}>{post.category}</Link> /{' '}
          <span className="text-gray-500">{post.title}</span>
        </div>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>อ่าน {post.views} ครั้ง</span>
          </div>
          
          {/* Category */}
          <div className="mb-6">
            <Link href={`/blog?category=${post.categorySlug}`}>
              <span className="bg-primary/90 text-white text-xs px-3 py-1 rounded-md">
                {post.category}
              </span>
            </Link>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-md">
          <img
            src={getImageUrl(post.image)}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="blog-content mb-8" 
             dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag.slug} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-default">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Author */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
              <img
                src={getImageUrl(post.authorAvatar)}
                alt={post.author}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-medium">{post.author}</h3>
              <p className="text-gray-500 mb-2">{post.authorTitle}</p>
              {post.authorBio && <p className="text-sm">{post.authorBio}</p>}
            </div>
          </div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">บทความที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map(related => (
                <Link href={`/blog/${related.slug}`} key={related.id} className="flex">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full w-full">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={getImageUrl(related.image)}
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-medium line-clamp-2">{related.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      
      <style jsx global>{`
        .blog-content {
          color: #000000 !important;
          line-height: 1.8;
          font-size: 1.125rem;
          font-weight: 400;
        }
        
        .blog-content p {
          margin-bottom: 1.5rem;
          margin-top: 1.5rem;
          color: #000000 !important;
        }
        
        .blog-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.2rem;
          color: #000000 !important;
        }
        
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: 600;
          margin-top: 2.2rem;
          margin-bottom: 1rem;
          color: #000000 !important;
        }
        
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.8rem;
          margin-bottom: 0.8rem;
          color: #000000 !important;
        }
        
        .blog-content ul, 
        .blog-content ol {
          padding-left: 1.8rem;
          margin: 1.5rem 0;
        }
        
        .blog-content li {
          margin-bottom: 0.7rem;
          color: #000000 !important;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #e2e8f0;
          padding: 0.8rem 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #000000 !important;
          background-color: #f8fafc;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .blog-content img {
          max-width: 100%;
          height: auto;
          margin: 2.5rem auto;
          border-radius: 0.5rem;
          display: block;
        }
        
        .blog-content div[data-youtube-video] {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 อัตราส่วน */
          height: 0;
          margin: 2.5rem auto;
          max-width: 90%;
          border-radius: 0.5rem;
          overflow: hidden;
        }
        
        .blog-content div[data-youtube-video] iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          border: none;
        }
        
        .blog-content a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        
        .blog-content a:hover {
          color: #1d4ed8;
        }
        
        .blog-content .text-align-left {
          text-align: left;
        }
        
        .blog-content .text-align-center {
          text-align: center;
        }
        
        .blog-content .text-align-right {
          text-align: right;
        }
        
        .blog-content pre {
          background-color: #f1f5f9;
          border-radius: 0.375rem;
          padding: 1.2rem;
          margin: 1.8rem 0;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.9rem;
          line-height: 1.6;
        }
      
      `}</style>
    </div>
  );
};

export default BlogDetailClient;