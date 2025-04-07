import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { verifyToken, hashPassword } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// GET - ดึงข้อมูลผู้ใช้ตาม ID
export async function GET(request, context) {
  try {
    const id = context.params.id;
    
    
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const currentUser = verifyToken(token);
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.id !== parseInt(id))) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    // ดึงข้อมูลผู้ใช้ (ไม่รวมรหัสผ่าน)
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
        WHERE id = ?
      `,
      values: [id]
    });
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้
export async function PUT(request, context) {
  try {
    const id = context.params.id;
    
    // ตรวจสอบสิทธิ์
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const currentUser = verifyToken(token);
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.id !== parseInt(id))) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await executeQuery({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    });
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }
    
    // รับข้อมูลจาก request
    const data = await request.json();
    
    // สร้างคำสั่ง SQL และค่าสำหรับการอัปเดต
    let query = 'UPDATE users SET ';
    const values = [];
    const updates = [];

    
    if (data.username) {
      // ตรวจสอบว่า username ซ้ำหรือไม่
      if (data.username !== existingUser[0].username) {
        const usernameCheck = await executeQuery({
          query: 'SELECT id FROM users WHERE username = ? AND id != ?',
          values: [data.username, id]
        });
        
        if (usernameCheck.length > 0) {
          return NextResponse.json(
            { error: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว' },
            { status: 400 }
          );
        }
      }
      updates.push('username = ?');
      values.push(data.username);
    }
    
    if (data.email) {
      // ตรวจสอบว่า email ซ้ำหรือไม่
      if (data.email !== existingUser[0].email) {
        const emailCheck = await executeQuery({
          query: 'SELECT id FROM users WHERE email = ? AND id != ?',
          values: [data.email, id]
        });
        
        if (emailCheck.length > 0) {
          return NextResponse.json(
            { error: 'อีเมลนี้มีอยู่ในระบบแล้ว' },
            { status: 400 }
          );
        }
      }
      updates.push('email = ?');
      values.push(data.email);
    }
    
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      updates.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (data.display_name) {
      updates.push('display_name = ?');
      values.push(data.display_name);
    }
    
    if (data.avatar) {
      updates.push('avatar = ?');
      values.push(data.avatar);
    }
    
    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }
    
    // เฉพาะ admin เท่านั้นที่สามารถเปลี่ยน role ได้
    if (data.role && currentUser.role === 'admin') {
      updates.push('role = ?');
      values.push(data.role);
    }
    
    // ถ้าไม่มีข้อมูลที่จะอัปเดต
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'ไม่มีข้อมูลที่จะอัปเดต' },
        { status: 400 }
      );
    }
    
   
    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);
    
    // อัปเดตข้อมูลผู้ใช้
    await executeQuery({
      query,
      values
    });
    
    // ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว (ไม่รวมรหัสผ่าน)
    const [updatedUser] = await executeQuery({
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
      values: [id]
    });
    
    // Revalidate เพื่อให้ข้อมูลเป็นปัจจุบัน
    revalidatePath('/admin/users');
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดตผู้ใช้' },
      { status: 500 }
    );
  }
}

// DELETE - ลบผู้ใช้
export async function DELETE(request, context) {
  try {
    const id = context.params.id;
    
    // ตรวจสอบสิทธิ์ admin
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const currentUser = verifyToken(token);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการทำรายการนี้' },
        { status: 403 }
      );
    }
    
    // ถ้าพยายามลบตัวเอง
    if (currentUser.id === parseInt(id)) {
      return NextResponse.json(
        { error: 'ไม่สามารถลบบัญชีตัวเองได้' },
        { status: 400 }
      );
    }
    
    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const existingUser = await executeQuery({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id]
    });
    
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'ไม่พบผู้ใช้' },
        { status: 404 }
      );
    }
    
    // ตรวจสอบว่าผู้ใช้นี้มีบทความหรือไม่
    const postsCount = await executeQuery({
      query: 'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      values: [id]
    });
    
    if (postsCount[0].count > 0) {
      return NextResponse.json(
        { 
          error: 'ไม่สามารถลบผู้ใช้นี้ได้เนื่องจากมีบทความที่เชื่อมโยงอยู่',
          postsCount: postsCount[0].count
        },
        { status: 400 }
      );
    }
    
    // ลบผู้ใช้
    await executeQuery({
      query: 'DELETE FROM users WHERE id = ?',
      values: [id]
    });
    
    // Revalidate เพื่อให้ข้อมูลเป็นปัจจุบัน
    revalidatePath('/admin/users');
    
    return NextResponse.json({ 
      success: true, 
      message: 'ลบผู้ใช้เรียบร้อยแล้ว',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' },
      { status: 500 }
    );
  }
}