import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET(request) {
  try {
    // ตรวจสอบสิทธิ์ admin
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
    
    // ดึงข้อมูลผู้ใช้ทั้งหมด โดยไม่ส่งคืนรหัสผ่าน
    const users = await executeQuery({
      query: `
        SELECT 
          id, 
          username, 
          email, 
          display_name, 
          avatar, 
          title, 
          bio, 
          role, 
          created_at, 
          updated_at
        FROM users
        ORDER BY created_at DESC
      `
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มผู้ใช้ใหม่
export async function POST(request) {
  try {
    // ตรวจสอบสิทธิ์ admin
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
    if (!data.username || !data.email || !data.password || !data.display_name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่า username และ email ไม่ซ้ำ
    const existingUser = await executeQuery({
      query: 'SELECT id FROM users WHERE username = ? OR email = ?',
      values: [data.username, data.email]
    });
    
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว' },
        { status: 400 }
      );
    }
    
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await hashPassword(data.password);
    
    // เพิ่มผู้ใช้ใหม่
    const result = await executeQuery({
      query: `
        INSERT INTO users (
          username, 
          email, 
          password, 
          display_name, 
          avatar, 
          title, 
          bio, 
          role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      values: [
        data.username,
        data.email,
        hashedPassword,
        data.display_name,
        data.avatar || '/avatar/default.webp',
        data.title || null,
        data.bio || null,
        data.role || 'author'
      ]
    });
    
    // ดึงข้อมูลผู้ใช้ที่เพิ่งสร้าง 
    const [newUser] = await executeQuery({
      query: `
        SELECT 
          id, 
          username, 
          email, 
          display_name, 
          avatar, 
          title, 
          bio, 
          role, 
          created_at, 
          updated_at
        FROM users 
        WHERE id = ?
      `,
      values: [result.insertId]
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างผู้ใช้' },
      { status: 500 }
    );
  }
}