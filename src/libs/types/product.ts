import { ObjectId } from "mongoose";
import {
  ProductCollection,
  ProductStatus,
  ProductSize,
} from "../enums/product.enum";

export interface Product {
  _id: ObjectId;
  productStatus: ProductStatus;
  ProductCollection: ProductCollection;
  productName: String;
  productPrice: Number;
  productLeftCount: Number;
  productSize: ProductSize;
  productVolume: String;
  productDesc?: String;
  productImages: String[];
  productViews: Number;
  createdAt: Date;
  updatedAt: Date;
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
  productPrice: Number;
  productLeftCount: Number;
  productSize?: ProductSize;
  productVolume?: String;
  productDesc?: String;
  productImages?: String[];
  productViews?: Number;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productStatus?: ProductStatus;
  ProductCollection?: ProductCollection;
  productName?: String;
  productPrice?: Number;
  productLeftCount?: Number;
  productSize?: ProductSize;
  productVolume?: String;
  productDesc?: String;
  productImages?: String[];
  productViews?: Number;
}
