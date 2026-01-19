import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import HomepageSettings from "@/lib/models/HomepageSettings";
import Post from "@/lib/models/Post";

// GET - Fetch all homepage settings
export async function GET() {
  try {
    await connectToDatabase();

    const settings = await HomepageSettings.find({}).lean();

    // Transform to object format
    const result = {
      hero: null,
      featured: null,
    };

    for (const setting of settings) {
      if (setting.key === "hero") {
        result.hero = {
          postId: setting.heroPostId?.toString() || null,
        };
      } else if (setting.key === "featured") {
        result.featured = {
          postIds: setting.featuredPostIds?.map((id) => id.toString()) || [],
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage settings" },
      { status: 500 },
    );
  }
}

// PUT - Update homepage settings
export async function PUT(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { type, heroPostId, featuredPostIds } = body;

    if (!type || !["hero", "featured"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'hero' or 'featured'" },
        { status: 400 },
      );
    }

    const updateData = { key: type };

    if (type === "hero") {
      updateData.heroPostId = heroPostId || null;
    } else if (type === "featured") {
      // Validate that posts exist
      if (featuredPostIds && Array.isArray(featuredPostIds)) {
        const validPosts = await Post.find({
          _id: { $in: featuredPostIds },
          status: "published",
        }).select("_id");

        const validIds = validPosts.map((p) => p._id.toString());
        updateData.featuredPostIds = featuredPostIds.filter((id) =>
          validIds.includes(id),
        );
      }
    }

    const setting = await HomepageSettings.findOneAndUpdate(
      { key: type },
      updateData,
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Error updating homepage settings:", error);
    return NextResponse.json(
      { error: "Failed to update homepage settings" },
      { status: 500 },
    );
  }
}
