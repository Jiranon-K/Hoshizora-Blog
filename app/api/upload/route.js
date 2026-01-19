import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import { verifyToken } from "@/lib/auth";
import { AppError, ErrorTypes } from "@/lib/error-handler";
import { uploadToR2 } from "@/lib/r2";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const IMAGE_QUALITY = 85;

export async function POST(request) {
  try {
    // Authentication check
    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      throw new AppError(ErrorTypes.UNAUTHORIZED, "ไม่ได้รับอนุญาต");
    }

    const user = verifyToken(token);
    if (!user) {
      throw new AppError(ErrorTypes.UNAUTHORIZED, "ไม่ได้รับอนุญาต");
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      throw new AppError(ErrorTypes.BAD_REQUEST, "ไม่พบไฟล์ในคำขอ");
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(
        ErrorTypes.VALIDATION,
        "ประเภทไฟล์ไม่ได้รับอนุญาต กรุณาอัพโหลดเฉพาะรูปภาพ",
        { allowedTypes: ALLOWED_TYPES },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        ErrorTypes.VALIDATION,
        `ขนาดไฟล์เกิน ${MAX_FILE_SIZE / (1024 * 1024)}MB กรุณาลดขนาดไฟล์`,
        { maxSize: MAX_FILE_SIZE, actualSize: file.size },
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${Date.now()}.webp`;

    // Process image with sharp (resize and convert to WebP)
    const processedImageBuffer = await sharp(buffer)
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: IMAGE_QUALITY })
      .toBuffer();

    // Upload to Cloudflare R2
    const publicUrl = await uploadToR2(
      processedImageBuffer,
      uniqueFilename,
      "image/webp",
    );

    return NextResponse.json({
      success: true,
      url: publicUrl, // Returns absolute R2 URL directly
      filename: uniqueFilename,
      originalSize: file.size,
      compressedSize: processedImageBuffer.length,
      compressionRatio: Math.round(
        ((file.size - processedImageBuffer.length) / file.size) * 100,
      ),
    });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);

    if (error instanceof AppError) {
      const { error: errorObj, status } = error.toResponse();
      return NextResponse.json(errorObj, { status });
    }

    return NextResponse.json(
      {
        error: error.message || "เกิดข้อผิดพลาดในการอัปโหลด",
      },
      { status: 500 },
    );
  }
}
