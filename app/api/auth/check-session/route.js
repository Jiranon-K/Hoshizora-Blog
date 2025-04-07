import { verifyToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('blog_token')?.value;
    
    // No token found
    if (!token) {
      return NextResponse.json(
        { valid: false, message: 'No session found' },
        { status: 401 }
      );
    }
    
    // Verify token
    const payload = verifyToken(token);
    
    // Token is invalid or expired
    if (!payload) {
      return NextResponse.json(
        { valid: false, message: 'Session expired' },
        { status: 401 }
      );
    }
    
    // Token is valid
    return NextResponse.json({
      valid: true,
      user: {
        id: payload.id,
        username: payload.username,
        role: payload.role
      }
    });
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { valid: false, message: 'Error checking session' },
      { status: 500 }
    );
  }
}