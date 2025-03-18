import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// GET - ดึงข้อมูลหมวดหมู่ทั้งหมด
export async function GET() {
  try {
    const categories = await executeQuery({
      query: `
        SELECT c.*, 
               (SELECT COUNT(*) FROM posts WHERE category_id = c.id) as post_count
        FROM categories c 
        ORDER BY name ASC
      `
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}

// POST - สร้างหมวดหมู่ใหม่
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
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    // รับข้อมูลจาก request
    const data = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: 'กรุณากรอกชื่อและ slug ของหมวดหมู่' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่า slug ซ้ำหรือไม่
    const existingCategory = await executeQuery({
      query: 'SELECT id FROM categories WHERE slug = ?',
      values: [data.slug]
    });
    
    if (existingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น' },
        { status: 400 }
      );
    }
    
    // เพิ่มหมวดหมู่ใหม่
    const result = await executeQuery({
      query: 'INSERT INTO categories (name, slug) VALUES (?, ?)',
      values: [data.name, data.slug]
    });
    
    // ดึงข้อมูลหมวดหมู่ที่เพิ่งสร้าง
    const [newCategory] = await executeQuery({
      query: 'SELECT * FROM categories WHERE id = ?',
      values: [result.insertId]
    });
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่' },
      { status: 500 }
    );
  }
}