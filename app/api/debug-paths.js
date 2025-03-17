// pages/api/debug-paths.js
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// ตรวจสอบโฟลเดอร์
function checkDirectory(dir) {
  try {
    const exists = fs.existsSync(dir);
    let writable = false;
    let files = [];
    
    if (exists) {
      try {
        // ทดสอบการเขียน
        const testFile = path.join(dir, `test-${Date.now()}.txt`);
        fs.writeFileSync(testFile, 'test');
        writable = true;
        fs.unlinkSync(testFile);
        
        // อ่านรายการไฟล์
        files = fs.readdirSync(dir);
      } catch (error) {
        return {
          exists,
          writable: false,
          error: error.message,
          files: []
        };
      }
    }
    
    return {
      exists,
      writable,
      error: null,
      files
    };
  } catch (error) {
    return {
      exists: false,
      writable: false,
      error: error.message,
      files: []
    };
  }
}

export async function GET(request) {
  try {
    const uploadDir = path.resolve('public/uploads');
    const publicDir = path.resolve('public');
    
    // ข้อมูลทั่วไป
    const info = {
      cwd: process.cwd(),
      uploadDir,
      publicDir,
      NODE_ENV: process.env.NODE_ENV,
      platform: process.platform,
      filePermissions: {}
    };
    
    // ตรวจสอบโฟลเดอร์
    info.uploadDirStatus = checkDirectory(uploadDir);
    info.publicDirStatus = checkDirectory(publicDir);
    
    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    if (!info.uploadDirStatus.exists) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        info.createdUploadDir = true;
        // ปรับสิทธิ์
        fs.chmodSync(uploadDir, 0o777);
        info.uploadDirStatus = checkDirectory(uploadDir);
      } catch (error) {
        info.createDirError = error.message;
      }
    }
    
    return NextResponse.json(info);
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}