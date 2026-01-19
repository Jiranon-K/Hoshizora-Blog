import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  try {
    await connectToDatabase();

    const posts = await Post.find()
      .populate("category", "name slug")
      .populate("category", "name slug")
      .populate("user", "displayName avatar")
      .sort({ createdAt: -1 })
      .lean();

    const transformedPosts = posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      featured_image: post.featuredImage,
      status: post.status,
      views: post.views,
      category_id: post.category?._id?.toString() || null,
      category_name: post.category?.name || null,
      user_id: post.user?._id?.toString() || null,
      published_at: post.publishedAt,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      updated_at: post.updatedAt,
      author: post.user?.displayName || "Unknown",
      author_avatar: post.user?.avatar || "",
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทความ" },
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
    if (!user || (user.role !== "admin" && user.role !== "author")) {
      return NextResponse.json(
        { error: "ไม่มีสิทธิ์ในการทำรายการนี้" },
        { status: 403 },
      );
    }

    const data = await request.json();

    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Check for existing slug
    const existingPost = await Post.findOne({ slug: data.slug });

    if (existingPost) {
      return NextResponse.json(
        { error: "Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น" },
        { status: 400 },
      );
    }

    // Create new post
    const newPost = await Post.create({
      title: data.title,
      slug: data.slug,
      description: data.description || "",
      content: data.content || "",
      featuredImage: data.featured_image || "",
      status: data.status || "draft",
      user: user.id,
      category: data.category_id || null,
      publishedAt: data.status === "published" ? new Date() : null,
    });

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json(
      {
        id: newPost._id.toString(),
        title: newPost.title,
        slug: newPost.slug,
        description: newPost.description,
        content: newPost.content,
        featured_image: newPost.featuredImage,
        status: newPost.status,
        user_id: newPost.user.toString(),
        category_id: newPost.category?.toString() || null,
        published_at: newPost.publishedAt,
        created_at: newPost.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างบทความ" },
      { status: 500 },
    );
  }
}
