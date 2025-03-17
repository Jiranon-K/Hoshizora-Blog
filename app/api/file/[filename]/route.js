import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const filename = params.filename;
    
   
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
    
    
    const ext = path.extname(filename).toLowerCase();
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
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการให้บริการไฟล์' },
      { status: 500 }
    );
  }
}