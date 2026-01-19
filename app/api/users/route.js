import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import { verifyToken, hashPassword } from "@/lib/auth";

export async function GET(request) {
  try {
    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Transform for frontend compatibility
    const transformedUsers = users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      display_name: u.displayName,
      avatar: u.avatar,
      title: u.title,
      bio: u.bio,
      role: u.role,
      created_at: u.createdAt,
      updated_at: u.updatedAt,
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    const data = await request.json();

    if (!data.email || !data.password || !data.display_name) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check for existing email
    const existingUser = await User.findOne({
      email: data.email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้มีอยู่ในระบบแล้ว" },
        { status: 400 },
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await User.create({
      email: data.email.toLowerCase(),
      password: hashedPassword,
      displayName: data.display_name,
      avatar: data.avatar || "/avatar/default.webp",
      title: data.title || "",
      bio: data.bio || "",
      role: data.role || "author",
    });

    return NextResponse.json(
      {
        id: newUser._id.toString(),
        email: newUser.email,
        display_name: newUser.displayName,
        avatar: newUser.avatar,
        title: newUser.title,
        bio: newUser.bio,
        role: newUser.role,
        created_at: newUser.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้" },
      { status: 500 },
    );
  }
}
