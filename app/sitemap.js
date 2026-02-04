import { getAllPostSlugs } from "@/lib/blogService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function sitemap() {
  // Get all blog post slugs
  const posts = await getAllPostSlugs();

  // Blog post URLs
  const blogUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  return [...staticPages, ...blogUrls];
}
