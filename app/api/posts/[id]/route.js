import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';




export async function GET(request, context) {
  try {
   
    const id = context.params.id;
    
 
    const posts = await executeQuery({
      query: `
        SELECT p.*, c.name as category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `,
      values: [id]
    });
    
    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบบทความนี้' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ' },
      { status: 500 }
    );
  }
}

// อัปเดตบทความ
export async function PUT(request, context) {
  try {
    
    const id = context.params.id;
    
   
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    
    const existingPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });
    
    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบบทความนี้' },
        { status: 404 }
      );
    }
    
    
    if (user.role !== 'admin' && existingPost[0].user_id !== user.id) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์แก้ไขบทความนี้' },
        { status: 403 }
      );
    }
    
    
    const data = await request.json();
    
    
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    
    if (data.slug !== existingPost[0].slug) {
      const slugCheck = await executeQuery({
        query: 'SELECT id FROM posts WHERE slug = ? AND id != ?',
        values: [data.slug, id]
      });
      
      if (slugCheck.length > 0) {
        return NextResponse.json(
          { error: 'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น' },
          { status: 400 }
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
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตบทความ' },
      { status: 500 }
    );
  }
}


export async function DELETE(request, context) {
  try {
    
    const id = context.params.id;
    
    console.log('Attempting to delete post with ID:', id);
    
   
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID ไม่ถูกต้อง' },
        { status: 400 }
      );
    }
    
   
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    
    const existingPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [id]
    });
    
    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบบทความนี้' },
        { status: 404 }
      );
    }
    
   
    if (user.role !== 'admin' && existingPost[0].user_id !== user.id) {
      return NextResponse.json(
        { error: 'คุณไม่มีสิทธิ์ลบบทความนี้' },
        { status: 403 }
      );
    }

    console.log('Authorization passed, proceeding with deletion...');
    
    try {
      
      await executeQuery({
        query: 'DELETE FROM posts WHERE id = ?',
        values: [id]
      });
      
      console.log('Post deleted successfully');
    
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath('/admin/posts');
      
      return NextResponse.json({ 
        success: true, 
        message: 'ลบบทความเรียบร้อยแล้ว',
        deletedId: id
      });
    } catch (dbError) {
      console.error('Database error when deleting post:', dbError);
      
     
      if (dbError.code === 'ER_ROW_IS_REFERENCED' || dbError.errno === 1451) {
        return NextResponse.json(
          { 
            error: 'ไม่สามารถลบบทความนี้ได้เนื่องจากมีข้อมูลที่เชื่อมโยงอยู่ กรุณาลบข้อมูลที่เชื่อมโยงก่อน',
            details: dbError.message
          },
          { status: 400 }
        );
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดในการลบบทความ', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}