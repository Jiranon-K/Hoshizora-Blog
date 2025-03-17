import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // ทดสอบหลายพาธ
    const results = {};
    const pathsToTest = [
      path.join(process.cwd(), 'public', 'uploads'),
      '/etc/dokploy/applications/jiranonk-hoshizora-blog-ubqv24/code/public/uploads',
      '/public/uploads',
      '/tmp'
    ];

    for (const testPath of pathsToTest) {
      results[testPath] = { exists: false, writable: false, error: null };
      
      try {
        await fs.mkdir(testPath, { recursive: true });
        results[testPath].exists = true;
        
        const testFile = path.join(testPath, `test-${Date.now()}.txt`);
        await fs.writeFile(testFile, 'test content');
        results[testPath].writable = true;
        
        // อ่านไฟล์เพื่อตรวจสอบว่าเขียนสำเร็จจริง
        const content = await fs.readFile(testFile, 'utf8');
        results[testPath].content = content;
        
        // ลบไฟล์ทดสอบ
        await fs.unlink(testFile);
        results[testPath].deleted = true;
      } catch (error) {
        results[testPath].error = error.message;
      }
    }

    return NextResponse.json({
      cwd: process.cwd(),
      results,
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}