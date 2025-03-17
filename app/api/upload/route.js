
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';


export async function POST(request) {
  try {
   
    let UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    let UPLOAD_DIR2 = '/etc/dokploy/applications/jiranonk-hoshizora-blog-ubqv24/code/public/uploads';
    let UPLOAD_DIR3 = '/public/uploads';
    
    console.log("กำลังทดสอบพาธทั้งหมด:", { 
      UPLOAD_DIR, 
      UPLOAD_DIR2, 
      UPLOAD_DIR3, 
      cwd: process.cwd() 
    });
    
   
    let workingDir = null;
    let dirsToTry = [UPLOAD_DIR, UPLOAD_DIR2, UPLOAD_DIR3];
    
    for (const dir of dirsToTry) {
      try {
        await fs.mkdir(dir, { recursive: true });
        
        const testPath = path.join(dir, `test-${Date.now()}.txt`);
        await fs.writeFile(testPath, 'test');
        await fs.unlink(testPath);
        workingDir = dir;
        console.log(`พบพาธที่ใช้งานได้: ${workingDir}`);
        break;
      } catch (e) {
        console.log(`ไม่สามารถใช้งานพาธ ${dir}: ${e.message}`);
      }
    }
    
    if (!workingDir) {
      return NextResponse.json({
        error: 'ไม่พบพาธที่สามารถเขียนไฟล์ได้',
        triedPaths: dirsToTry
      }, { status: 500 });
    }
    
    
    UPLOAD_DIR = workingDir;
    
  
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      console.error("ไม่พบไฟล์ในคำขอ");
      return NextResponse.json({ error: 'ไม่พบไฟล์ในคำขอ' }, { status: 400 });
    }
    
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    console.log(`กำลังบันทึกไฟล์ที่: ${filePath}`);
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.writeFile(filePath, buffer);
    console.log(`บันทึกไฟล์สำเร็จที่ ${filePath}`);
    
   
    const stats = await fs.stat(filePath);
    console.log(`ไฟล์ถูกสร้างขนาด: ${stats.size} bytes`);
    
    
    const imageUrl = `/uploads/${uniqueFilename}`;
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: uniqueFilename,
      fullPath: filePath,
      size: stats.size,
      workingDir: UPLOAD_DIR
    });
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}