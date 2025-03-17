import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';

export async function GET() {
  try {
    const info = {
      cwd: process.cwd(),
      env: process.env.NODE_ENV,
      platform: process.platform,
      paths: {}
    };
    
    // ตรวจสอบพาธที่เกี่ยวข้อง
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads');
    
    info.paths.public = publicDir;
    info.paths.uploads = uploadDir;
    
    // ทดสอบการเขียนไฟล์
    let writeTest = { success: false, error: null };
    try {
      const testFile = path.join(uploadDir, `test-${Date.now()}.txt`);
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(testFile, 'test content');
      await fs.access(testFile);
      await fs.unlink(testFile);
      writeTest.success = true;
    } catch (error) {
      writeTest.success = false;
      writeTest.error = error.message;
    }
    
    info.writeTest = writeTest;
    
    // ตรวจสอบพื้นที่ว่าง
    if (process.platform === 'linux') {
      try {
        const dfOutput = execSync('df -h').toString();
        info.diskSpace = dfOutput;
      } catch (error) {
        info.diskSpaceError = error.message;
      }
    }
    
    // ตรวจสอบสิทธิ์ในโฟลเดอร์
    if (process.platform === 'linux') {
      try {
        const lsOutput = execSync(`ls -la ${uploadDir}`).toString();
        info.permissions = lsOutput;
      } catch (error) {
        info.permissionsError = error.message;
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