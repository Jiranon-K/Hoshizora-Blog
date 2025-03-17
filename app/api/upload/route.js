import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
   
    const paths = [
      path.join(process.cwd(), 'public', 'uploads'),
      '/app/public/uploads',
      '/public/uploads'
    ];
    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ในคำขอ' }, { status: 400 });
    }
    
    const fileExtension = path.extname(file.name) || '.webp';
    
    const uniqueFilename = `${uuidv4()}-${Date.now()}${fileExtension}`;
    
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const savedFiles = [];
    const errors = [];
    
    for (const dir of paths) {
      try {
        await fs.mkdir(dir, { recursive: true });
        const filePath = path.join(dir, uniqueFilename);
        await fs.writeFile(filePath, buffer);
        
      
        const stat = await fs.stat(filePath);
        savedFiles.push({
          path: filePath,
          size: stat.size
        });
      } catch (err) {
        errors.push({
          path: dir,
          error: err.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      url: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
      savedFiles,
      errors,
      message: 'บันทึกไฟล์สำเร็จในพาธต่างๆ'
    });
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}