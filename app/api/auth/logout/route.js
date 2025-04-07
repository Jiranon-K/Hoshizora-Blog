import { NextResponse } from 'next/server';

export async function POST() {
  try {
    
    const response = NextResponse.json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });
    
   
    response.cookies.set({
      name: 'blog_token',
      value: '',
      httpOnly: true,
      expires: new Date(0), 
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการออกจากระบบ' },
      { status: 500 }
    );
  }
}