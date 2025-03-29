import mongoose, { Schema } from "mongoose";
import { ArticleCollection, ArticleStatus } from "../libs/enums/article.enum";

const articleSchema = new Schema(
  {
    articleStatus: {
      type: String,
      enum: ArticleStatus,
      default: ArticleStatus.ACTIVE,
    },

    articleCollection: {
      type: String,
      enum: ArticleCollection,
      required: true,
    },

    articleName: {
      type: String,
      required: true,
    },

    productAuthor: {
      type: String,
      required: true,
    },

    articleTitle: {
      type: String,
      required: true,
    },

    articleDesc: {
      type: String,
      required: true,
    },

    articleImages: {
      type: [String],
      default: [],
    },

    articleViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } //updatedAt, createdAt
);

articleSchema.index(
  { articleName: 1, articleTitle: 1, articleCollection: 1 },
  { unique: true }
);

export default mongoose.model("Article", articleSchema);
