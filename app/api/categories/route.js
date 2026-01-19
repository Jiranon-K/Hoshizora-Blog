import { connectToDatabase } from "@/lib/db";
import Category from "@/lib/models/Category";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find().sort({ name: 1 }).lean();

    // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const postCount = await Post.countDocuments({
          category: cat._id,
          status: "published",
        });
        return {
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          post_count: postCount,
          created_at: cat.createdAt,
          updated_at: cat.updatedAt,
        };
      }),
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่" },
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

    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อและ slug ของหมวดหมู่" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check for existing slug
    const existingCategory = await Category.findOne({ slug: data.slug });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น" },
        { status: 400 },
      );
    }

    const newCategory = await Category.create({
      name: data.name,
      slug: data.slug.toLowerCase(),
      description: data.description || "",
    });

    return NextResponse.json(
      {
        id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        created_at: newCategory.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างหมวดหมู่" },
      { status: 500 },
    );
  }
}
