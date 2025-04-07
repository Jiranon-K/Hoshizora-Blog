import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET - ดึงข้อมูลหมวดหมู่ตาม ID
export async function GET(request, context) {
  try {
    const id = context.params.id;
    
    const categories = await executeQuery({
      query: `
        SELECT c.*, 
               (SELECT COUNT(*) FROM posts WHERE category_id = c.id) as post_count 
        FROM categories c 
        WHERE c.id = ?
      `,
      values: [id]
    });
    
    if (categories.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบหมวดหมู่นี้' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(categories[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลหมวดหมู่
export async function PUT(request, context) {
  try {
    const id = context.params.id;
    
    // ตรวจสอบการยืนยันตัวตน
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
    
    // ตรวจสอบว่าหมวดหมู่มีอยู่หรือไม่
    const existingCategory = await executeQuery({
      query: 'SELECT * FROM categories WHERE id = ?',
      values: [id]
    });
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบหมวดหมู่นี้' },
        { status: 404 }
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
    
    // ตรวจสอบว่า slug ซ้ำหรือไม่ (ยกเว้นรายการปัจจุบัน)
    if (data.slug !== existingCategory[0].slug) {
      const slugCheck = await executeQuery({
        query: 'SELECT id FROM categories WHERE slug = ? AND id != ?',
        values: [data.slug, id]
      });
      
      if (slugCheck.length > 0) {
        return NextResponse.json(
          { error: 'Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น' },
          { status: 400 }
        );
      }
    }
    
    // อัปเดตข้อมูลหมวดหมู่
    await executeQuery({
      query: `
        UPDATE categories
        SET name = ?, slug = ?
        WHERE id = ?
      `,
      values: [data.name, data.slug, id]
    });
    
    // Revalidate เพื่อให้ข้อมูลเป็นปัจจุบัน
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin/categories');
    
    // ดึงข้อมูลหมวดหมู่ที่อัปเดต
    const [updatedCategory] = await executeQuery({
      query: 'SELECT * FROM categories WHERE id = ?',
      values: [id]
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่' },
      { status: 500 }
    );
  }
}

// DELETE - ลบหมวดหมู่
export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    
    // ตรวจสอบการยืนยันตัวตน
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
    
    // ตรวจสอบว่าหมวดหมู่มีอยู่หรือไม่
    const existingCategory = await executeQuery({
      query: 'SELECT * FROM categories WHERE id = ?',
      values: [id]
    });
    
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบหมวดหมู่นี้' },
        { status: 404 }
      );
    }
    
    // ตรวจสอบว่ามีบทความที่ใช้หมวดหมู่นี้หรือไม่
    const postsCount = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM posts WHERE category_id = ?',
      values: [id]
    });
    
    if (postsCount[0].count > 0) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถลบหมวดหมู่นี้ได้เนื่องจากมีบทความที่ใช้หมวดหมู่นี้อยู่',
          postsCount: postsCount[0].count
        },
        { status: 400 }
      );
    }
    
    // ลบหมวดหมู่
    await executeQuery({
      query: 'DELETE FROM categories WHERE id = ?',
      values: [id]
    });
    
    // Revalidate เพื่อให้ข้อมูลเป็นปัจจุบัน
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin/categories');
    
    return NextResponse.json({ 
      success: true, 
      message: 'ลบหมวดหมู่เรียบร้อยแล้ว',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบหมวดหมู่' },
      { status: 500 }
    );
  }
}