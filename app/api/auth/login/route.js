import { loginUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    
    const { usernameOrEmail, password } = await request.json();
    
    
    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    
    
    const result = await loginUser(usernameOrEmail, password);
    
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }
    
    
    const response = NextResponse.json({
      success: true,
      user: result.user
    });
    
   
    response.cookies.set({
      name: 'blog_token',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 12, 
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการล็อกอิน' },
      { status: 500 }
    );
  }
}