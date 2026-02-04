import { cache } from "react";
import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";

/**
 * Get post details by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} - Post data with author, category, and related posts
 */
export const getPostDetails = cache(async function (slug) {
  try {
    await connectToDatabase();

    await Post.updateOne({ slug, status: "published" }, { $inc: { views: 1 } });

    const post = await Post.findOne({ slug, status: "published" })
      .populate("user", "displayName title avatar bio")
      .populate("category", "name slug")
      .lean();

    if (!post) {
      return null;
    }

    const formattedDate = formatDate(post.publishedAt);

    const processedContent = post.content
      ? transformYoutubeEmbeds(post.content)
      : "";

    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      description: post.description,
      content: processedContent,
      image: post.featuredImage,
      date: formattedDate,
      views: post.views,
      category: post.category?.name || null,
      categorySlug: post.category?.slug || null,
      author: post.user?.displayName || null,
      authorTitle: post.user?.title || null,
      authorAvatar: post.user?.avatar || null,
      authorBio: post.user?.bio || null,
      slug: post.slug,
    };

    const relatedPosts = await getRelatedPosts(slug, post.category?._id);

    return {
      post: formattedPost,
      relatedPosts,
    };
  } catch (error) {
    console.error("Error fetching post details:", error);
    return null;
  }
});

/**
 * Format date to Thai locale
 * @param {Date} dateString - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("th-TH", options);
}

/**
 * Get related posts from the same category
 * @param {string} slug - Current post slug (to exclude)
 * @param {ObjectId} categoryId - Category ID to filter by
 * @returns {Array} - Array of related posts
 */
async function getRelatedPosts(slug, categoryId) {
  if (!categoryId) return [];

  try {
    const posts = await Post.find({
      category: categoryId,
      slug: { $ne: slug },
      status: "published",
    })
      .select("id title featuredImage slug")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    // Transform to match existing structure
    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      image: post.featuredImage,
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

/**
 * Get tags for a post
 * @param {ObjectId} postId - Post ID
 * @returns {Array} - Array of tags
 */
async function getPostTags(postId) {
  try {
    const post = await Post.findById(postId)
      .populate("tags", "name slug")
      .lean();

    if (!post || !post.tags) return [];

    return post.tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    }));
  } catch (error) {
    console.error("Error fetching post tags:", error);
    return [];
  }
}

/**
 * Transform YouTube iframes to use privacy-enhanced embed
 * @param {string} content - HTML content
 * @returns {string} - Transformed content
 */
function transformYoutubeEmbeds(content) {
  return content.replace(
    /<iframe(.*?)src="https:\/\/www\.youtube\.com\/embed\/(.*?)"(.*?)><\/iframe>/g,
    '<div data-youtube-video><iframe src="https://www.youtube-nocookie.com/embed/$2" frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>',
  );
}

/**
 * Get all post slugs for static generation
 * @returns {Array} - Array of slug objects for generateStaticParams
 */
export async function getAllPostSlugs() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: "published" })
      .select("slug")
      .lean();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

export { getRelatedPosts, getPostTags, formatDate, transformYoutubeEmbeds };
