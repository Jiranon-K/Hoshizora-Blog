import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { AppError, ErrorTypes, handleApiError } from '@/lib/error-handler';

// GET handler to fetch a single post by ID
export async function GET(request, context) {
  try {
    const id = context.params.id;

    const post = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });

    if (post.length === 0) {
      throw new AppError(
        ErrorTypes.NOT_FOUND,
        'ไม่พบบทความนี้'
      );
    }

    return NextResponse.json(post[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}

// DELETE handler to delete a post by ID
export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    
    // Verify authentication
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      throw new AppError(
        ErrorTypes.UNAUTHORIZED,
        'ไม่ได้รับอนุญาต'
      );
    }
    
    const user = verifyToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      throw new AppError(
        ErrorTypes.FORBIDDEN,
        'ไม่มีสิทธิ์ในการทำรายการนี้'
      );
    }
    
    // Check if post exists
    const existingPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });
    
    if (existingPost.length === 0) {
      throw new AppError(
        ErrorTypes.NOT_FOUND,
        'ไม่พบบทความนี้'
      );
    }
    
    // Check if user has permission to delete (admin or author of the post)
    if (user.role !== 'admin' && existingPost[0].user_id !== user.id) {
      throw new AppError(
        ErrorTypes.FORBIDDEN,
        'คุณไม่มีสิทธิ์ลบบทความนี้'
      );
    }
    
    // Delete the post
    await executeQuery({
      query: 'DELETE FROM posts WHERE id = ?',
      values: [id]
    });
    
    // Revalidate paths
    revalidatePath('/');
    revalidatePath('/blog');
    
    return NextResponse.json({ 
      success: true, 
      message: 'ลบบทความเรียบร้อยแล้ว' 
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}

export async function PUT(request, context) {
  try {
    const id = context.params.id;
    
   
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      throw new AppError(
        ErrorTypes.UNAUTHORIZED,
        'ไม่ได้รับอนุญาต'
      );
    }
    
    const user = verifyToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      throw new AppError(
        ErrorTypes.FORBIDDEN,
        'ไม่มีสิทธิ์ในการทำรายการนี้'
      );
    }
    
    
    const existingPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });
    
    if (existingPost.length === 0) {
      throw new AppError(
        ErrorTypes.NOT_FOUND,
        'ไม่พบบทความนี้'
      );
    }
    
    
    if (user.role !== 'admin' && existingPost[0].user_id !== user.id) {
      throw new AppError(
        ErrorTypes.FORBIDDEN,
        'คุณไม่มีสิทธิ์แก้ไขบทความนี้'
      );
    }
    
    
    const data = await request.json();
    
    
    if (!data.title || !data.slug) {
      throw new AppError(
        ErrorTypes.VALIDATION,
        'กรุณากรอกข้อมูลให้ครบถ้วน', 
        { requiredFields: ['title', 'slug'] }
      );
    }
    
    
    if (data.slug !== existingPost[0].slug) {
      const slugCheck = await executeQuery({
        query: 'SELECT id FROM posts WHERE slug = ? AND id != ?',
        values: [data.slug, id]
      });
      
      if (slugCheck.length > 0) {
        throw new AppError(
          ErrorTypes.VALIDATION,
          'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น',
          { field: 'slug' }
        );
      }
    }
    
    
    const publishedAt = existingPost[0].published_at || 
                       (data.status === 'published' && existingPost[0].status !== 'published' ? 
                       new Date() : null);
    
   
    await executeQuery({
      query: `
        UPDATE posts
        SET 
          title = ?, 
          slug = ?, 
          description = ?, 
          content = ?, 
          featured_image = ?, 
          status = ?, 
          category_id = ?,
          published_at = ?
        WHERE id = ?
      `,
      values: [
        data.title,
        data.slug,
        data.description || null,
        data.content || null,
        data.featured_image || null,
        data.status || 'draft',
        data.category_id || null,
        publishedAt,
        id
      ]
    });
    
   
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);
    
   
    const updatedPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });
    
    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    
    
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}