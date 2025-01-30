import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductStatus,
  ProductSize,
} from "../enums/product.enum";
import { Like } from "./like";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  ProductCollection: ProductCollection;
  productName: String;
  productAuthor: String;
  productPrice: Number;
  productLeftCount: Number;
  productSize: ProductSize;
  productVolume: String;
  productDesc?: String;
  productImages: String[];
  productLikes: Number;
  productViews: Number;
  createdAt: Date;
  updatedAt: Date;
  like?: Like;
}

export interface ProductInquery {
  order: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  ProductCollection: ProductCollection;
  productName: String;
  productAuthor: String;
  productPrice: Number;
  productLeftCount: Number;
  productSize?: ProductSize;
  productVolume?: String;
  productDesc?: String;
  productImages?: String[];
  productLikes?: Number;
  productViews?: Number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  ProductCollection?: ProductCollection;
  productName?: String;
  productAuthor?: String;
  productPrice?: Number;
  productLeftCount?: Number;
  productSize?: ProductSize;
  productVolume?: String;
  productDesc?: String;
  productImages?: String[];
  productLikes?: Number;
  productViews?: Number;
}
