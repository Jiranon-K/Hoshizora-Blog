import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    console.log("เริ่มกระบวนการอัปโหลด");
    
    
    const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    console.log("โฟลเดอร์ที่ใช้:", UPLOAD_DIR);
    
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      console.log("ตรวจสอบ/สร้างโฟลเดอร์สำเร็จ:", UPLOAD_DIR);
      
     
      const testFilePath = path.join(UPLOAD_DIR, `test-${Date.now()}.txt`);
      await fs.writeFile(testFilePath, 'test');
      console.log("เขียนไฟล์ทดสอบสำเร็จ:", testFilePath);
      
      await fs.unlink(testFilePath);
      console.log("ลบไฟล์ทดสอบสำเร็จ");
    } catch (mkdirError) {
      console.error("ไม่สามารถสร้างหรือเขียนในโฟลเดอร์ได้:", mkdirError);
      return NextResponse.json({ 
        error: `ไม่สามารถสร้างหรือเขียนในโฟลเดอร์ได้: ${mkdirError.message}`,
        path: UPLOAD_DIR,
        cwd: process.cwd()
      }, { status: 500 });
    }
    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      console.error("ไม่พบไฟล์ในคำขอ");
      return NextResponse.json({ error: 'ไม่พบไฟล์ในคำขอ' }, { status: 400 });
    }
    
    console.log(`ชื่อไฟล์: ${file.name}, ประเภท: ${file.type}, ขนาด: ${file.size} bytes`);
    
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'ไฟล์ที่อัพโหลดต้องเป็นรูปภาพเท่านั้น' }, { status: 400 });
    }
    
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    console.log(`กำลังบันทึกไฟล์ที่: ${filePath}`);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await fs.writeFile(filePath, buffer);
      console.log("บันทึกไฟล์สำเร็จ");
      
      // ตรวจสอบว่าไฟล์ถูกสร้างจริงหรือไม่
      const stats = await fs.stat(filePath);
      console.log(`ไฟล์ถูกสร้างขนาด: ${stats.size} bytes`);
      
      const imageUrl = `/uploads/${uniqueFilename}`;
      console.log("การอัปโหลดสำเร็จ! URL:", imageUrl);
      
      return NextResponse.json({
        success: true,
        url: imageUrl,
        filename: uniqueFilename,
        size: stats.size
      });
      
    } catch (writeError) {
      console.error("เกิดข้อผิดพลาดในการเขียนไฟล์:", writeError);
      return NextResponse.json({ 
        error: `ไม่สามารถบันทึกไฟล์ได้: ${writeError.message}`,
        path: filePath
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
    return NextResponse.json({ 
      error: `เกิดข้อผิดพลาดในการอัปโหลด: ${error.message}`,
      stack: error.stack
    }, { status: 500 });
  }
}