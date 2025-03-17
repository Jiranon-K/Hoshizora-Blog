import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';


const UPLOAD_DIR = path.resolve('public/uploads');

export async function GET(request) {
  try {
    console.log("กำลังดึงรายการรูปภาพ");
    console.log("โฟลเดอร์ที่ใช้:", UPLOAD_DIR);
    
    // เช็คว่าโฟลเดอร์มีอยู่จริงไหม
    if (!fs.existsSync(UPLOAD_DIR)) {
      console.log("ไม่พบโฟลเดอร์ uploads");
      try {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        console.log("สร้างโฟลเดอร์ uploads สำเร็จ");
      } catch (error) {
        console.error("ไม่สามารถสร้างโฟลเดอร์ uploads:", error.message);
        return NextResponse.json({ 
          error: 'ไม่พบโฟลเดอร์อัปโหลด', 
          currentPath: process.cwd(),
          uploadDir: UPLOAD_DIR,
          exists: false 
        }, { status: 404 });
      }
    }
    
    // ปิดการตรวจสอบสิทธิ์ชั่วคราว
    /*
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      console.log("ไม่มี token ในคุกกี้");
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }
    
    const user = verifyToken(token);
    if (!user) {
      console.log("Token ไม่ถูกต้อง");
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการเข้าถึงรูปภาพ' },
        { status: 403 }
      );
    }
    */
    
    let files = [];
    try {
      console.log("กำลังอ่านรายการไฟล์จากโฟลเดอร์");
      files = await readdir(UPLOAD_DIR);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการอ่านไฟล์:", error.message);
      
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
    
    console.log(`พบรูปภาพทั้งหมด ${imageFiles.length} ไฟล์`);
    
    const images = imageFiles.map(file => ({
      name: file,
      url: `/uploads/${file}`
    }));
    
    return NextResponse.json({ 
      images,
      success: true,
      uploadDir: UPLOAD_DIR,
      workingDir: process.cwd()
    });
    
  } catch (error) {
    console.error('Error listing uploaded images:', error);
    return NextResponse.json(
      { 
        error: 'เกิดข้อผิดพลาดในการดึงรายการรูปภาพ',
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}