import mongoose from "mongoose";

const homepageSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["hero", "featured"],
    },
    // For Hero section - specific post ID (null = use latest)
    heroPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    // For Featured section - ordered array of post IDs [1st, 2nd, 3rd]
    featuredPostIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const HomepageSettings =
  mongoose.models.HomepageSettings ||
  mongoose.model("HomepageSettings", homepageSettingsSchema);

export default HomepageSettings;
