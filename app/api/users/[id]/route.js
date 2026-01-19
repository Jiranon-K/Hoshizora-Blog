import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";
import { verifyToken, hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const currentUser = verifyToken(token);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.id !== id)
    ) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      display_name: user.displayName,
      avatar: user.avatar,
      title: user.title,
      bio: user.bio,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 },
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const currentUser = verifyToken(token);
    if (
      !currentUser ||
      (currentUser.role !== "admin" && currentUser.id !== id)
    ) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    const data = await request.json();

    // Check for duplicate email
    if (data.email && data.email !== existingUser.email) {
      const emailCheck = await User.findOne({
        email: data.email.toLowerCase(),
        _id: { $ne: id },
      });

      if (emailCheck) {
        return NextResponse.json(
          { error: "อีเมลนี้มีอยู่ในระบบแล้ว" },
          { status: 400 },
        );
      }
    }

    // Update fields
    if (data.email) existingUser.email = data.email.toLowerCase();
    if (data.password)
      existingUser.password = await hashPassword(data.password);
    if (data.display_name) existingUser.displayName = data.display_name;
    if (data.avatar) existingUser.avatar = data.avatar;
    if (data.title !== undefined) existingUser.title = data.title;
    if (data.bio !== undefined) existingUser.bio = data.bio;

    // Only admin can change roles
    if (data.role && currentUser.role === "admin") {
      existingUser.role = data.role;
    }

    await existingUser.save();

    revalidatePath("/admin/users");

    return NextResponse.json({
      id: existingUser._id.toString(),
      email: existingUser.email,
      display_name: existingUser.displayName,
      avatar: existingUser.avatar,
      title: existingUser.title,
      bio: existingUser.bio,
      role: existingUser.role,
      updated_at: existingUser.updatedAt,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
    }

    const currentUser = verifyToken(token);
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    // Prevent self-deletion
    if (currentUser.id === id) {
      return NextResponse.json(
        { error: "ไม่สามารถลบบัญชีตัวเองได้" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    // Check for existing posts
    const postsCount = await Post.countDocuments({ user: id });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          error: "ไม่สามารถลบผู้ใช้นี้ได้เนื่องจากมีบทความที่เชื่อมโยงอยู่",
          postsCount,
        },
        { status: 400 },
      );
    }

    await User.findByIdAndDelete(id);

    revalidatePath("/admin/users");

    return NextResponse.json({
      success: true,
      message: "ลบผู้ใช้เรียบร้อยแล้ว",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบผู้ใช้" },
      { status: 500 },
    );
  }
}
