import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');


async function ensureDirectoryExists(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function POST(request) {
  try {
    
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการอัพโหลดรูปภาพ' },
        { status: 403 }
      );
    }

    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์รูปภาพ' },
        { status: 400 }
      );
    }
    
   
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const fileType = file.type;
    
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'ไฟล์ที่อัพโหลดต้องเป็นรูปภาพเท่านั้น' },
        { status: 400 }
      );
    }
    
    
    const fileExtension = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    
  
    await ensureDirectoryExists(UPLOAD_DIR);
  
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    await writeFile(filePath, buffer);
    
   
    const imageUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({
      success: true,
      url: imageUrl
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' },
      { status: 500 }
    );
  }
}