import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';


export async function GET(request) {
  try {
    
    const posts = await executeQuery({
      query: `
        SELECT p.*, c.name as category_name
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.created_at DESC
      `
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลบทความ' },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
   
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
    
    
    const data = await request.json();
    
    
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    
    const existingPost = await executeQuery({
      query: 'SELECT id FROM posts WHERE slug = ?',
      values: [data.slug]
    });
    
    if (existingPost.length > 0) {
      return NextResponse.json(
        { error: 'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น' },
        { status: 400 }
      );
    }
    
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${data.slug}`);
    
    const result = await executeQuery({
      query: `
        INSERT INTO posts (
          title, 
          slug, 
          description, 
          content, 
          featured_image, 
          status, 
          user_id, 
          category_id,
          published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.title,
        data.slug,
        data.description || null,
        data.content || null,
        data.featured_image || null,
        data.status || 'draft',
        user.id,
        data.category_id || null,
        data.status === 'published' ? new Date() : null
      ]
    });

    
    
   
    const newPost = await executeQuery({
      query: 'SELECT * FROM posts WHERE id = ?',
      values: [result.insertId]
    });
    
    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างบทความ' },
      { status: 500 }
    );
  }
}