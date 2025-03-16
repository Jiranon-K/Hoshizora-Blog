import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { readdir } from 'fs/promises';
import path from 'path';


const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET(request) {
  try {
   
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการเข้าถึงรูปภาพ' },
        { status: 403 }
      );
    }

    
    let files = [];
    try {
      files = await readdir(UPLOAD_DIR);
    } catch (error) {
     
      if (error.code === 'ENOENT') {
        return NextResponse.json({ images: [] });
      }
      throw error;
    }
    
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
  
    const images = imageFiles.map(file => ({
      name: file,
      url: `/uploads/${file}`
    }));
    
    return NextResponse.json({ images });
    
  } catch (error) {
    console.error('Error listing uploaded images:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงรายการรูปภาพ' },
      { status: 500 }
    );
  }
}