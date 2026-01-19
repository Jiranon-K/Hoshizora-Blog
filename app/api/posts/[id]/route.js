import { connectToDatabase } from "@/lib/db";
import Post from "@/lib/models/Post";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { AppError, ErrorTypes, handleApiError } from "@/lib/error-handler";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    await connectToDatabase();

    const post = await Post.findById(id)
      .populate("category", "name slug")
      .populate("user", "displayName title avatar")
      .lean();

    if (!post) {
      throw new AppError(ErrorTypes.NOT_FOUND, "ไม่พบบทความนี้");
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      throw new AppError(ErrorTypes.UNAUTHORIZED, "ไม่ได้รับอนุญาต");
    }

    const user = verifyToken(token);
    if (!user || (user.role !== "admin" && user.role !== "author")) {
      throw new AppError(ErrorTypes.FORBIDDEN, "ไม่มีสิทธิ์ในการทำรายการนี้");
    }

    await connectToDatabase();

    const existingPost = await Post.findById(id);

    if (!existingPost) {
      throw new AppError(ErrorTypes.NOT_FOUND, "ไม่พบบทความนี้");
    }

    if (user.role !== "admin" && existingPost.user.toString() !== user.id) {
      throw new AppError(ErrorTypes.FORBIDDEN, "คุณไม่มีสิทธิ์ลบบทความนี้");
    }

    await Post.findByIdAndDelete(id);

    revalidatePath("/");
    revalidatePath("/blog");

    return NextResponse.json({
      success: true,
      message: "ลบบทความเรียบร้อยแล้ว",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;

    const token = request.cookies.get("blog_token")?.value;
    if (!token) {
      throw new AppError(ErrorTypes.UNAUTHORIZED, "ไม่ได้รับอนุญาต");
    }

    const user = verifyToken(token);
    if (!user || (user.role !== "admin" && user.role !== "author")) {
      throw new AppError(ErrorTypes.FORBIDDEN, "ไม่มีสิทธิ์ในการทำรายการนี้");
    }

    await connectToDatabase();

    const existingPost = await Post.findById(id);

    if (!existingPost) {
      throw new AppError(ErrorTypes.NOT_FOUND, "ไม่พบบทความนี้");
    }

    if (user.role !== "admin" && existingPost.user.toString() !== user.id) {
      throw new AppError(ErrorTypes.FORBIDDEN, "คุณไม่มีสิทธิ์แก้ไขบทความนี้");
    }

    const data = await request.json();

    if (!data.title || !data.slug) {
      throw new AppError(ErrorTypes.VALIDATION, "กรุณากรอกข้อมูลให้ครบถ้วน", {
        requiredFields: ["title", "slug"],
      });
    }

    if (data.slug !== existingPost.slug) {
      const slugCheck = await Post.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });

      if (slugCheck) {
        throw new AppError(
          ErrorTypes.VALIDATION,
          "Slug นี้ถูกใช้งานแล้ว กรุณาเลือก slug อื่น",
          { field: "slug" },
        );
      }
    }

    const publishedAt =
      existingPost.publishedAt ||
      (data.status === "published" && existingPost.status !== "published"
        ? new Date()
        : null);

    existingPost.title = data.title;
    existingPost.slug = data.slug;
    existingPost.description = data.description || "";
    existingPost.content = data.content || "";
    existingPost.featuredImage = data.featured_image || "";
    existingPost.status = data.status || "draft";
    existingPost.category = data.category_id || null;
    existingPost.publishedAt = publishedAt;

    await existingPost.save();

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${data.slug}`);

    return NextResponse.json({
      id: existingPost._id.toString(),
      title: existingPost.title,
      slug: existingPost.slug,
      description: existingPost.description,
      content: existingPost.content,
      featured_image: existingPost.featuredImage,
      status: existingPost.status,
      category_id: existingPost.category?.toString() || null,
      published_at: existingPost.publishedAt,
      updated_at: existingPost.updatedAt,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    const { error: errorObj, status } = handleApiError(error);
    return NextResponse.json(errorObj, { status });
  }
}
