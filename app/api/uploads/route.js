// แก้ไขไฟล์ app/api/uploads/route.js ให้สอดคล้องกับการแก้ไขด้านบน
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    let UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
    let UPLOAD_DIR2 = '/etc/dokploy/applications/jiranonk-hoshizora-blog-ubqv24/code/public/uploads';
    let UPLOAD_DIR3 = '/public/uploads';
    
    
    let workingDir = null;
    let dirsToTry = [UPLOAD_DIR, UPLOAD_DIR2, UPLOAD_DIR3];
    
    for (const dir of dirsToTry) {
      if (fs.existsSync(dir)) {
        try {
         
          const testPath = path.join(dir, `test-${Date.now()}.txt`);
          fs.writeFileSync(testPath, 'test');
          fs.unlinkSync(testPath);
          workingDir = dir;
          console.log(`พบพาธที่ใช้งานได้: ${workingDir}`);
          break;
        } catch (e) {
          console.log(`พาธ ${dir} มีอยู่แต่ไม่สามารถเขียนได้: ${e.message}`);
        }
      } else {
        console.log(`พาธ ${dir} ไม่มีอยู่`);
        try {
          fs.mkdirSync(dir, { recursive: true });
          workingDir = dir;
          break;
        } catch (e) {
          console.log(`ไม่สามารถสร้างพาธ ${dir}: ${e.message}`);
        }
      }
    }
    
    if (!workingDir) {
      return NextResponse.json({
        error: 'ไม่พบพาธที่สามารถเขียนไฟล์ได้',
        triedPaths: dirsToTry,
        cwd: process.cwd()
      }, { status: 500 });
    }
    
   
    UPLOAD_DIR = workingDir;
    
    let files = [];
    try {
      files = fs.readdirSync(UPLOAD_DIR);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ 
          images: [],
          usedPath: UPLOAD_DIR
        });
      }
      throw error;
    }
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    
    const images = imageFiles.map(file => ({
      name: file,
      url: `/uploads/${file}`,
      fullPath: path.join(UPLOAD_DIR, file)
    }));
    
    return NextResponse.json({ 
      images,
      success: true,
      usedPath: UPLOAD_DIR,
    });
    
  } catch (error) {
    console.error('Error listing uploaded images:', error);
    return NextResponse.json(
      { 
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}