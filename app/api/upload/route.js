import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { verifyToken } from '@/lib/auth';
import { AppError, ErrorTypes } from '@/lib/error-handler';


const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const IMAGE_QUALITIES = {
  jpeg: 85,
  webp: 85,
  png: 85,
  gif: 85
};

export async function POST(request) {
  try {
    
    const token = request.cookies.get('blog_token')?.value;
    if (!token) {
      throw new AppError(
        ErrorTypes.UNAUTHORIZED,
        'ไม่ได้รับอนุญาต'
      );
    }
    
    const user = verifyToken(token);
    if (!user) {
      throw new AppError(
        ErrorTypes.UNAUTHORIZED,
        'ไม่ได้รับอนุญาต'
      );
    }
    
    const paths = [
      path.join(process.cwd(), 'public', 'uploads'),
      '/app/public/uploads',
      '/public/uploads'
    ];
    
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      throw new AppError(
        ErrorTypes.BAD_REQUEST,
        'ไม่พบไฟล์ในคำขอ'
      );
    }
    
   
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(
        ErrorTypes.VALIDATION,
        'ประเภทไฟล์ไม่ได้รับอนุญาต กรุณาอัพโหลดเฉพาะรูปภาพ',
        { allowedTypes: ALLOWED_TYPES }
      );
    }
    
    
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        ErrorTypes.VALIDATION,
        `ขนาดไฟล์เกิน ${MAX_FILE_SIZE / (1024 * 1024)}MB กรุณาลดขนาดไฟล์`,
        { maxSize: MAX_FILE_SIZE, actualSize: file.size }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    
    const originalExt = path.extname(file.name).toLowerCase();
    const outputExt = '.webp'; 
    
    const uniqueFilename = `${uuidv4()}-${Date.now()}${outputExt}`;
    
    
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width: 1200,         
        height: 1200,        
        fit: 'inside',       
        withoutEnlargement: true 
      })
      .webp({ quality: IMAGE_QUALITIES.webp }) 
      .toBuffer();
    
   
    const savedFiles = [];
    const errors = [];
    
    for (const dir of paths) {
      try {
        await fs.mkdir(dir, { recursive: true });
        const filePath = path.join(dir, uniqueFilename);
        await fs.writeFile(filePath, processedImageBuffer);
        
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
    
   
    if (savedFiles.length > 0) {
      return NextResponse.json({
        success: true,
        url: `/api/file/${uniqueFilename}`,
        filename: uniqueFilename,
        originalSize: file.size,
        compressedSize: savedFiles[0].size,
        compressionRatio: Math.round((file.size - savedFiles[0].size) / file.size * 100),
        savedFiles,
        errors: errors.length > 0 ? errors : undefined
      });
    } else {
      throw new AppError(
        ErrorTypes.INTERNAL_SERVER,
        'ไม่สามารถบันทึกไฟล์ได้ในทุกตำแหน่ง',
        { errors }
      );
    }
    
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
    
    
    if (error instanceof AppError) {
      const { error: errorObj, status } = error.toResponse();
      return NextResponse.json(errorObj, { status });
    }
    
    return NextResponse.json({ 
      error: error.message || 'เกิดข้อผิดพลาดในการอัปโหลด',
    }, { status: 500 });
  }
}