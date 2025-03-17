import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


const UPLOAD_DIR = '/etc/dokploy/applications/jiranonk-blog-q8pgy1/code/public/uploads';  

export async function POST(request) {
  try {
    console.log("เริ่มกระบวนการอัปโหลด");
    console.log("โฟลเดอร์ที่ใช้:", UPLOAD_DIR);
    
    
    try {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      console.log("ตรวจสอบ/สร้างโฟลเดอร์สำเร็จ:", UPLOAD_DIR);
    } catch (mkdirError) {
      console.error("ไม่สามารถสร้างโฟลเดอร์ได้:", mkdirError);
      return NextResponse.json({ 
        error: `ไม่สามารถสร้างโฟลเดอร์ได้: ${mkdirError.message}`,
        path: UPLOAD_DIR 
      }, { status: 500 });
    }
    
   
    try {
      
      const testPath = path.join(UPLOAD_DIR, `test-${Date.now()}.txt`);
      await fs.writeFile(testPath, 'test');
    
      await fs.unlink(testPath);
      console.log("สามารถเขียนไฟล์ในโฟลเดอร์ได้");
    } catch (writeTestError) {
      console.error("ไม่สามารถเขียนไฟล์ทดสอบได้:", writeTestError);
      return NextResponse.json({ 
        error: `ไม่สามารถเขียนไฟล์ทดสอบได้: ${writeTestError.message}`,
        path: UPLOAD_DIR 
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
      
      
      try {
        await fs.access(filePath);
        console.log(`ไฟล์ถูกสร้างสำเร็จที่: ${filePath}`);
      } catch (accessError) {
        console.error("ไม่พบไฟล์หลังจากบันทึก:", accessError);
        return NextResponse.json({ 
          error: `ไม่พบไฟล์หลังจากบันทึก: ${accessError.message}` 
        }, { status: 500 });
      }
      
     
      try {
        
        await fs.chmod(filePath, 0o644);
      } catch (chmodError) {
        console.warn("ไม่สามารถปรับสิทธิ์ไฟล์ได้:", chmodError);
       
      }
      
      const imageUrl = `/uploads/${uniqueFilename}`;
      console.log("การอัปโหลดสำเร็จ! URL:", imageUrl);
      
      return NextResponse.json({
        success: true,
        url: imageUrl,
        filename: uniqueFilename,
        path: filePath
      });
      
    } catch (writeError) {
      console.error("เกิดข้อผิดพลาดในการเขียนไฟล์:", writeError);
      return NextResponse.json({ 
        error: `ไม่สามารถบันทึกไฟล์ได้: ${writeError.message}` 
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