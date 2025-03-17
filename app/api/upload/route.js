import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.resolve('public/uploads');


async function ensureDirectoryExists(dir) {
  try {
   
    if (!fs.existsSync(dir)) {
      console.log(`สร้างไดเร็กทอรี: ${dir}`);
      await mkdir(dir, { recursive: true });
     
      fs.chmodSync(dir, 0o777);
      console.log(`สร้างไดเร็กทอรีสำเร็จ: ${dir}`);
    }
  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการสร้างไดเร็กทอรี ${dir}:`, error);
    throw new Error(`ไม่สามารถสร้างไดเร็กทอรีได้: ${error.message}`);
  }
}

export async function POST(request) {
  try {
    console.log("เริ่มกระบวนการอัปโหลดรูปภาพ");
    console.log("โฟลเดอร์ที่ใช้:", UPLOAD_DIR);
    
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
    if (!user || (user.role !== 'admin' && user.role !== 'author')) {
      console.log("ผู้ใช้ไม่มีสิทธิ์เพียงพอ");
      return NextResponse.json(
        { error: 'ไม่มีสิทธิ์ในการอัพโหลดรูปภาพ' },
        { status: 403 }
      );
    }
    */

    
    const formData = await request.formData();
    const file = formData.get('image');
    
    
    if (!file) {
      console.log("ไม่พบไฟล์รูปภาพในคำขอ");
      return NextResponse.json(
        { error: 'ไม่พบไฟล์รูปภาพ' },
        { status: 400 }
      );
    }
    
   
    console.log(`ข้อมูลไฟล์: ชื่อ=${file.name}, ประเภท=${file.type}, ขนาด=${file.size} bytes`);
    
  
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name;
    const fileType = file.type;
    
    if (!fileType.startsWith('image/')) {
      console.log(`ประเภทไฟล์ไม่ถูกต้อง: ${fileType}`);
      return NextResponse.json(
        { error: 'ไฟล์ที่อัพโหลดต้องเป็นรูปภาพเท่านั้น' },
        { status: 400 }
      );
    }
    

    const fileExtension = path.extname(filename);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    console.log(`สร้างชื่อไฟล์ที่ไม่ซ้ำกัน: ${uniqueFilename}`);
    
 
    console.log(`ตรวจสอบไดเร็กทอรี: ${UPLOAD_DIR}`);
    await ensureDirectoryExists(UPLOAD_DIR);
  
   
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    console.log(`จะบันทึกไฟล์ที่: ${filePath}`);
    
    try {
      
      await writeFile(filePath, buffer);
 
      fs.chmodSync(filePath, 0o666);
      console.log(`บันทึกไฟล์สำเร็จที่: ${filePath}`);
    } catch (writeError) {
      console.error("เกิดข้อผิดพลาดในการเขียนไฟล์:", writeError);
      return NextResponse.json(
        { error: `ไม่สามารถบันทึกไฟล์ได้: ${writeError.message}` },
        { status: 500 }
      );
    }
    
  
    const imageUrl = `/uploads/${uniqueFilename}`;
    console.log(`URL ของรูปภาพ: ${imageUrl}`);
    
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: uniqueFilename,
      path: filePath,
      workingDir: process.cwd()
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { 
        error: `เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ${error.message}`,
        stack: error.stack,
        workingDir: process.cwd()
      },
      { status: 500 }
    );
  }
}