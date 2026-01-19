import { NextResponse } from "next/server";
import path from "path";

/**
 * This route now acts as a redirect proxy to R2 for backwards compatibility.
 * Old URLs like /api/file/image.webp will redirect to R2.
 *
 * For new content, the frontend should use R2 URLs directly.
 */
export async function GET(request, { params }) {
  try {
    const { filename } = await params;

    // Validate filename to prevent directory traversal attacks
    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Only allow image files
    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
    ];
    const ext = path.extname(filename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Check if R2_PUBLIC_URL is configured
    const r2PublicUrl = process.env.R2_PUBLIC_URL;

    if (r2PublicUrl) {
      // Redirect to R2 CDN with permanent redirect
      return NextResponse.redirect(
        `${r2PublicUrl}/${filename}`,
        { status: 301 }, // Permanent redirect for caching
      );
    }

    // Fallback: If R2 is not configured, return 404
    // This handles the transition period
    return NextResponse.json(
      { error: "File storage not configured. Please upload files again." },
      { status: 404 },
    );
  } catch (error) {
    console.error("Error in file route:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการให้บริการไฟล์" },
      { status: 500 },
    );
  }
}
