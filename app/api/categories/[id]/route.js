import { connectToDatabase } from "@/lib/db";
import Category from "@/lib/models/Category";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    await connectToDatabase();

    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่นี้" }, { status: 404 });
    }

    const postCount = await Post.countDocuments({ category: id });

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      post_count: postCount,
      created_at: category.createdAt,
      updated_at: category.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่" },
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

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่นี้" }, { status: 404 });
    }

    const data = await request.json();

    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อและ slug ของหมวดหมู่" },
        { status: 400 },
      );
    }

    if (data.slug !== existingCategory.slug) {
      const slugCheck = await Category.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });

      if (slugCheck) {
        return NextResponse.json(
          { error: "Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น" },
          { status: 400 },
        );
      }
    }

    existingCategory.name = data.name;
    existingCategory.slug = data.slug.toLowerCase();
    existingCategory.description = data.description || "";

    await existingCategory.save();

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/categories");

    return NextResponse.json({
      id: existingCategory._id.toString(),
      name: existingCategory.name,
      slug: existingCategory.slug,
      description: existingCategory.description,
      updated_at: existingCategory.updatedAt,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่" },
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

    const user = verifyToken(token);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
      return NextResponse.json({ error: "ไม่พบหมวดหมู่นี้" }, { status: 404 });
    }

    const postsCount = await Post.countDocuments({ category: id });

    if (postsCount > 0) {
      return NextResponse.json(
        {
          error:
            "ไม่สามารถลบหมวดหมู่นี้ได้เนื่องจากมีบทความที่ใช้หมวดหมู่นี้อยู่",
          postsCount,
        },
        { status: 400 },
      );
    }

    await Category.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/categories");

    return NextResponse.json({
      success: true,
      message: "ลบหมวดหมู่เรียบร้อยแล้ว",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบหมวดหมู่" },
      { status: 500 },
    );
  }
}
