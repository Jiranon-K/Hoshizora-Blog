import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const publicDir = path.join(process.cwd(), 'public');
    
    
    const info = {
      cwd: process.cwd(),
      uploadDir,
      publicDir,
      NODE_ENV: process.env.NODE_ENV,
      platform: process.platform,
    };
    
    
    info.uploadDirExists = fs.existsSync(uploadDir);
    info.publicDirExists = fs.existsSync(publicDir);
    
   
    if (!info.uploadDirExists) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
        info.createdUploadDir = true;
        info.uploadDirExists = fs.existsSync(uploadDir);
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