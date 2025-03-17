
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');


async function ensureDirectoryExists(dir) {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`กำลังสร้างโฟลเดอร์: ${dir}`);
      await fs.promises.mkdir(dir, { recursive: true });
      console.log(`สร้างโฟลเดอร์สำเร็จ: ${dir}`);
    }
  } catch (error) {
    console.error(`เกิดข้อผิดพลาดในการสร้างโฟลเดอร์: ${error.message}`);
    throw error;
  }
}

export async function POST(request) {
  try {
    console.log("เริ่มกระบวนการอัปโหลดรูปภาพ");
    console.log("โฟลเดอร์ที่จะใช้:", UPLOAD_DIR);
    

    await ensureDirectoryExists(UPLOAD_DIR);
    
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
    
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
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
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    console.log(`กำลังบันทึกไฟล์ที่: ${filePath}`);
    
    try {
      await writeFile(filePath, fileBuffer);
      console.log(`บันทึกไฟล์สำเร็จที่: ${filePath}`);
      
     
      const fileExists = fs.existsSync(filePath);
      console.log(`ไฟล์มีอยู่จริงหลังจากบันทึก: ${fileExists}`);
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
      filename: uniqueFilename
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: `เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ: ${error.message}` },
      { status: 500 }
    );
  }
}