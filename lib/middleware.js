import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Routes that require admin authentication
const protectedPaths = [
  '/admin',
  '/admin/posts',
  '/admin/categories',
  '/admin/users',
];

// Routes that should be protected but also handle file operations
const uploadApiPaths = [
  '/api/upload',
  '/api/uploads',
  '/api/debug-paths'
];

// Track login attempts for rate limiting
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export function middleware(request) {
  // Rate limiting for login attempts
  if (request.nextUrl.pathname === '/api/auth/login') {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const currentTime = Date.now();
    
    if (loginAttempts.has(clientIp)) {
      const { count, timestamp } = loginAttempts.get(clientIp);
      
      // Reset attempts after lockout period
      if (currentTime - timestamp > LOCKOUT_TIME) {
        loginAttempts.set(clientIp, { count: 1, timestamp: currentTime });
      } else if (count >= MAX_LOGIN_ATTEMPTS) {
        return NextResponse.json(
          { success: false, message: 'Too many login attempts. Please try again later.' },
          { status: 429 }
        );
      } else {
        loginAttempts.set(clientIp, { count: count + 1, timestamp });
      }
    } else {
      loginAttempts.set(clientIp, { count: 1, timestamp: currentTime });
    }
  }
  
  // Check if request is for upload API routes
  const isUploadApi = uploadApiPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  // Upload APIs now require authentication too
  if (isUploadApi) {
    const token = request.cookies.get('blog_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.next();
  }
  
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

 
  if (!isProtectedPath) {
    return NextResponse.next();
  }


  const token = request.cookies.get('blog_token')?.value;
  
 
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

 
  const payload = verifyToken(token);
  
 
  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Add expired=true parameter to indicate session expired
    url.searchParams.set('expired', 'true');
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

 
  if (payload.role !== 'admin') {
   
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  
  return NextResponse.next();
}


export const config = {
  matcher: [
    '/admin/:path*',  
    '/api/admin/:path*',
    '/api/upload',
    '/api/uploads',
    '/api/debug-paths'
  ],
};