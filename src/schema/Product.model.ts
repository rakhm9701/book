import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,

  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    productAuthor: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.A4,
    },

    productVolume: {
      type: String,
      enum: ProductVolume,
      default: ProductVolume.PICTURE_BOOK,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String],
      default: [],
    },

    productLikes: {
      type: Number,
      default: 0,
    },

    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } //updatedAt, createdAt
);

productSchema.index(
  { productName: 1, productSize: 1, productValume: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
