import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json({ error: 'กรุณาระบุชื่อไฟล์ที่ต้องการตรวจสอบ' }, { status: 400 });
    }
    
   
    const pathsToCheck = [
      path.join(process.cwd(), 'public', 'uploads', filename),
      path.join('/app/public/uploads', filename),
      path.join('/public/uploads', filename),
      path.join('/etc/dokploy/applications/jiranonk-hoshizora-blog-ubqv24/code/public/uploads', filename)
    ];
    
    const results = {};
    
    for (const filePath of pathsToCheck) {
      try {
        const stat = await fs.stat(filePath);
        results[filePath] = {
          exists: true,
          size: stat.size,
          modifiedTime: stat.mtime
        };
      } catch (err) {
        results[filePath] = {
          exists: false,
          error: err.message
        };
      }
    }
    
    
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      filename,
      publicUrl,
      results,
      cwd: process.cwd()
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}