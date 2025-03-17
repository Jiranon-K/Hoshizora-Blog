import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';


const protectedPaths = [
  '/admin',
  '/admin/posts',
  '/admin/categories',
  '/admin/users',
];


const uploadApiPaths = [
  '/api/upload',
  '/api/uploads',
  '/api/debug-paths'
];

export function middleware(request) {
  
  const isUploadApi = uploadApiPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );
  
  
  if (isUploadApi) {
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