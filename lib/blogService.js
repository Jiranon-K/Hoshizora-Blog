
import { executeQuery } from '@/lib/db';

export async function getPostDetails(slug) {
  try {
    // ยอดวิว
    await executeQuery({
      query: 'UPDATE posts SET views = views + 1 WHERE slug = ?',
      values: [slug]
    });
    
    // ดึงข้อมูลบทความ
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

    // จัดรูปแบบวันที่
    post.date = formatDate(post.date);
    
    // ดึงบทความที่เกี่ยวข้อง
    const relatedPosts = await getRelatedPosts(slug, post.category_id);
    
    // ดึงแท็ก
    const tags = await getPostTags(post.id);
    
    // แปลง YouTube URLs
    if (post.content) {
      post.content = transformYoutubeEmbeds(post.content);
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

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('th-TH', options);
}

async function getRelatedPosts(slug, categoryId) {
  return executeQuery({
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
}

async function getPostTags(postId) {
  return executeQuery({
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
    values: [postId]
  });
}

function transformYoutubeEmbeds(content) {
  return content.replace(
    /<iframe(.*?)src="https:\/\/www\.youtube\.com\/embed\/(.*?)"(.*?)><\/iframe>/g,
    '<div data-youtube-video><iframe src="https://www.youtube-nocookie.com/embed/$2" frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>'
  );
}