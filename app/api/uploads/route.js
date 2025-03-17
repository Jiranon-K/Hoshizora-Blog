import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    
    
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
    
   
    
    let files = [];
    try {
      console.log("กำลังอ่านรายการไฟล์จากโฟลเดอร์");
      files = fs.readdirSync(UPLOAD_DIR);
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