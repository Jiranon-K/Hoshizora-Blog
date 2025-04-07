import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    // Validate filename to prevent directory traversal attacks
    const filename = params.filename;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    // Only allow image files to be served
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: 'Invalid file type' },
        { status: 400 }
      );
    }
    
    // Safe paths to check for the file
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'uploads', filename),
      path.join('/app/public/uploads', filename),
      path.join('/public/uploads', filename)
    ];
    
    let filePath = null;
    let fileContent = null;
    
   
    for (const pathToTry of possiblePaths) {
      try {
        await fs.access(pathToTry);
        filePath = pathToTry;
        fileContent = await fs.readFile(pathToTry);
        break;
      } catch (e) {
       
      }
    }
    
    if (!filePath || !fileContent) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์' },
        { status: 404 }
      );
    }
    
    
    // Use the ext variable already declared above instead of redeclaring it
    let contentType = 'application/octet-stream'; 
    
    if (ext === '.jpg' || ext === '.jpeg') {
      contentType = 'image/jpeg';
    } else if (ext === '.png') {
      contentType = 'image/png';
    } else if (ext === '.gif') {
      contentType = 'image/gif';
    } else if (ext === '.webp') {
      contentType = 'image/webp';
    } else if (ext === '.svg') {
      contentType = 'image/svg+xml';
    }
    
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', 
      }
    });
    
  } catch (error) {
    // Log error internally but don't expose details
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการให้บริการไฟล์' },
      { status: 500 }
    );
  }
}