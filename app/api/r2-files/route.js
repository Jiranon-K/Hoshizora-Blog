import { NextResponse } from "next/server";
import { listR2Files } from "@/lib/r2";

export async function GET() {
  try {
    const files = await listR2Files();
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching R2 files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
